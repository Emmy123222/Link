import axios from "npm:axios";
import orderBy from "npm:lodash.orderby";
import moment from "npm:moment";
import { supabase, TABLES } from "../db.ts";
import {
  BadRequestException,
  ForbiddenException,
  handleException,
} from "../exceptions.ts";
import { createCrezcoPaymentDemand, CrezcoConfig } from "./crezco_utils.ts";

const crezcoApiUrl = Deno.env.get("CREZCO_API_URL")!;

// Constants for payment service types and transaction statuses
export enum PaymentServiceType {
  Crezco = "crezco"
}

export enum TransactionSummaryStatus {
  SUCCESSFUL = "SUCCESSFUL",
  PENDING = "PENDING",
  FAILED = "FAILED"
}

export enum TransactionSummaryType {
  PAYMENT = "PAYMENT"
}

export enum TransactionMethodUsed {
  PAY_BY_BANK_ACCOUNT = "PAY_BY_BANK_ACCOUNT"
}

// Helper functions
async function checkRequestBelongsToUser(userId: string, reqId: string) {
  const { data: request } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq('id', reqId)
    .single();

  if (!request) throw new BadRequestException("Request not found");
  if (request.vendorOwnerId !== userId && request.customerOwnerId !== userId) {
    throw new ForbiddenException("No permission to access this request");
  }

  return request;
}

async function update_payment_request_after_payment(reqId: string, amount: number, service: PaymentServiceType) {
  const { data: request } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq('id', reqId)
    .single();

  if (!request) throw new BadRequestException("Request not found");

  const paid_amount = (request.paid_amount || 0) + amount;
  const payment_done = paid_amount >= request.amount;

  await supabase
    .from(TABLES.DocumentHeader)
    .update({
      paid_amount,
      payment_done,
      payment_service_provider: service,
      status: payment_done ? 'Paid' : request.status
    })
    .eq('id', reqId);
}

async function getUserActivePlans(userId: string) {
  const { data: plans } = await supabase
    .from('user_plans')
    .select()
    .eq('user_id', userId)
    .eq('active', true);

  return plans || [];
}

Deno.serve(async (req) => {
  const { action, data } = await req.json();

  return handleException(async () => {
    switch (action) {
      case "crezco_user_onboarded":
        return handle_crezco_user_onboarded(data);
      case "crezco_create_payment_demand":
        return handle_crezco_create_payment_demand(data);
      case "crezco_webhook_callback":
        return handle_crezco_webhook_callback(req);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  });
});

async function handle_crezco_user_onboarded(data: any) {
  const { businessId, crezcoUserId, uid } = data;

  const { data: business } = await supabase
    .from(TABLES.Business)
    .select()
    .eq('id', businessId)
    .eq('ownerId', uid)
    .single();

  if (!business) {
    throw new ForbiddenException("No permission");
  }

  // Store Crezco service info
  await supabase
    .from('business_payment_services')
    .upsert({
      business_id: businessId,
      service_type: PaymentServiceType.Crezco,
      user_id: crezcoUserId
    });

  // Handle free plan
  const { data: existingPlan } = await supabase
    .from('user_plans')
    .select()
    .eq('user_id', uid)
    .eq('plan', 'FREE')
    .eq('from_business', businessId)
    .single();

  if (!existingPlan) {
    await supabase.from('user_plans').insert({
      user_id: uid,
      plan: 'FREE',
      created_at: new Date().toISOString(),
      active: true,
      from_business: businessId
    });
  }

  const userActivePlans = await getUserActivePlans(uid);
  return { status: "success", plans: userActivePlans };
}

async function handle_crezco_create_payment_demand(data: any) {
  const { reqId, uid, amount, url } = data;

  const request = await checkRequestBelongsToUser(uid, reqId);
  if (!request) {
    throw new ForbiddenException("No permission");
  }

  // Check active plans
  const userActivePlans = await getUserActivePlans(request.vendorOwnerId);
  if (!userActivePlans.some(plan => plan.transactions > 0)) {
    throw new BadRequestException(
      "Couldn't process the payment. Your vendor must have an active payment plan."
    );
  }

  // Get vendor's Crezco service info
  const { data: crezcoService } = await supabase
    .from('business_payment_services')
    .select()
    .eq('business_id', request.vendorId)
    .eq('service_type', PaymentServiceType.Crezco)
    .single();

  if (!crezcoService) {
    throw new BadRequestException("Vendor's Crezco service not found");
  }

  // Get vendor details
  const { data: vendor } = await supabase
    .from(TABLES.Business)
    .select()
    .eq('id', request.vendorId)
    .single();

  if (!vendor) {
    throw new BadRequestException("Vendor not found");
  }

  const appDomain = Deno.env.get('APP_DOMAIN');
  const statusUri = `https://${appDomain}/open-banking/payment/status?amount=${amount}&currency=${request.currency}&name=${vendor.business_name}&url=${url}`;
  const errorUri = encodeURIComponent(`${statusUri}&status=error`);
  const successUri = encodeURIComponent(`${statusUri}&status=success`);

  return await createCrezcoPaymentDemand(
    crezcoService.user_id,
    amount,
    (request.document_type === "Payment request" ? "PR" : "INV") + request.req_number,
    request.currency,
    { payment_request: reqId },
    successUri,
    errorUri,
    "BankSelection"
  );
}

async function handle_crezco_webhook_callback(req: Request) {
  const events = req.body;

  await Promise.all(events.map(async (event: any) => {
    const demandResult = await axios.get(
      `${crezcoApiUrl}/v1/pay-demands/${event.metadata.payDemandId}`,
      CrezcoConfig
    );

    if (demandResult.status !== 200 || !demandResult.data.metadata.payment_request) {
      return;
    }

    const reqId = demandResult.data.metadata.payment_request;
    let transactionId = null;

    if (event.eventType !== "PaymentPending") {
      const { data: transactions } = await supabase
        .from('document_transactions')
        .select()
        .eq('document_id', reqId)
        .eq('metadata->pay_demand_id', event.metadata.payDemandId);

      if (transactions?.length > 0) {
        transactionId = transactions[0].id;
      }
    }

    switch (event.eventType) {
      case "PaymentCompleted":
        await update_payment_request_after_payment(
          reqId,
          demandResult.data.amount,
          PaymentServiceType.Crezco
        );

        if (transactionId) {
          await supabase
            .from('document_transactions')
            .update({
              updated_at: event.timestamp,
              status: TransactionSummaryStatus.SUCCESSFUL
            })
            .eq('id', transactionId);
        }
        break;

      case "PaymentPending":
        await supabase
          .from('document_transactions')
          .insert({
            document_id: reqId,
            created_at: event.timestamp,
            amount: demandResult.data.amount,
            currency: demandResult.data.currency,
            status: TransactionSummaryStatus.PENDING,
            method: TransactionMethodUsed.PAY_BY_BANK_ACCOUNT,
            type: TransactionSummaryType.PAYMENT,
            service: PaymentServiceType.Crezco,
            metadata: {
              pay_demand_id: event.metadata.payDemandId,
              payment_uri: demandResult.data.paymentUri
            }
          });
        break;

      default:
        if (transactionId) {
          const statusesRes = await axios.get(
            `${crezcoApiUrl}/v1/pay-demands/${event.metadata.payDemandId}/payments`,
            CrezcoConfig
          );

          let status = TransactionSummaryStatus.FAILED;
          if (statusesRes.status === 200) {
            const orderedStatuses = orderBy(
              statusesRes.data,
              (o: any) => moment(o.created).format("YYYYMMDDHHmm"),
              ["desc"]
            );
            if (orderedStatuses.length > 0) {
              status = orderedStatuses[0].status.code.toUpperCase();
            }
          }

          await supabase
            .from('document_transactions')
            .update({
              updated_at: event.timestamp,
              status
            })
            .eq('id', transactionId);
        }
    }
  }));

  return new Response(JSON.stringify({ status: "success" }), {
    headers: { "Content-Type": "application/json" },
  });
}
