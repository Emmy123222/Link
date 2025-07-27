import axios from "npm:axios";
import { Buffer } from "npm:buffer";
import { serve } from "npm:std/http/server.ts";
import { supabase, TABLES } from "../db.ts";
import { send_email } from "../email_sending/index.ts";
import {
  BadRequestException,
  ForbiddenException,
  handleException,
} from "../exceptions.ts";
import {
  amountToPence,
  amountToPound,
  baseUrl,
  createGlobalPayTransaction,
  get_global_pay_service,
  globalPayGenerateAccessToken,
  headers,
  PaymentServiceType
} from "./global_pay_utils.ts";

// Types
interface RequestBody {
  action: string;
  data: any;
}

interface CheckEnrollmentRequest {
  userId: string;
  request: {
    paymentRequestId: string;
    amount: number;
    currency: string;
  };
  card: {
    reference: string;
  };
}

interface ChallengeNotificationRequest {
  cres: string;
}

interface MethodNotificationRequest {
  threeDSMethodData: string;
}

interface InitiateAuthenticationRequest {
  versionCheckData: {
    id: string;
  };
  request: {
    paymentRequestId: string;
    amount: number;
    currency: string;
    requestUrl: string;
  };
  card: {
    reference: string;
  };
  challengeWindow: {
    windowSize: string;
  };
  screen: {
    height: number;
    width: number;
  };
  timezone: string;
  userId: string;
}

// Application status enum
export enum ApplicationStatus {
  SUBMITTED = "SUBMITTED"
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

serve(async (req: Request) => {
  const body = await req.json() as RequestBody;
  const { action, data } = body;

  return handleException(async () => {
    switch (action) {
      case "get_access_token":
        return handle_get_access_token(data);
      case "check_enrollment":
        return handle_check_enrollment(data as CheckEnrollmentRequest);
      case "challenge_notification":
        return handle_challenge_notification(data as ChallengeNotificationRequest);
      case "method_notification":
        return handle_method_notification(data as MethodNotificationRequest);
      case "initiate_authentication":
        return handle_initiate_authentication(data as InitiateAuthenticationRequest);
      case "process_card":
        return handle_process_card(data);
      case "refund":
        return handle_refund(data);
      case "submit_application":
        return handle_submit_application(data);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  });
});

async function handle_get_access_token(data: any) {
  const { reqId, uid } = data;
  const request = await checkRequestBelongsToUser(uid, reqId);

  if (!request) {
    throw new ForbiddenException("Access denied");
  }

  const globalPayService = await get_global_pay_service(request.vendorId);
  if (!globalPayService.app_key || !globalPayService.app_id) {
    throw new ForbiddenException("Access denied");
  }

  const accessToken = await globalPayGenerateAccessToken(
    globalPayService.app_id,
    globalPayService.app_key,
    true
  );

  if (!accessToken) {
    throw new BadRequestException("Failed to generate access token");
  }

  return { status: "success", accessToken };
}

async function handle_check_enrollment(data: CheckEnrollmentRequest) {
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");
  const FUNCTION_URL = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");

  const paymentRequestData = await checkRequestBelongsToUser(
    data.userId,
    data.request.paymentRequestId
  );

  if (!paymentRequestData) {
    throw new ForbiddenException("Access denied");
  }

  if (paymentRequestData.payment_done || paymentRequestData.amountRemaining === 0) {
    throw new BadRequestException("Payment request is fully paid");
  }

  const globalPayService = await get_global_pay_service(paymentRequestData.vendorId);
  const accessToken = await globalPayGenerateAccessToken(
    globalPayService.app_id,
    globalPayService.app_key
  );

  const amountPence = amountToPence(data.request.amount);
  const callbackUrl = Deno.env.get("ENVIRONMENT") === 'production'
    ? `https://${APP_DOMAIN}`
    : `${FUNCTION_URL}/functions/v1`;

  const response = await axios.post(
    `${baseUrl}/authentications`,
    {
      account_name: "transaction_processing",
      reference: data.request.paymentRequestId,
      amount: amountPence,
      currency: data.request.currency,
      country: "GB",
      source: "BROWSER",
      payment_method: {
        id: data.card.reference,
      },
      notifications: {
        challenge_return_url: `${callbackUrl}/global_pay_challenge_notification`,
        three_ds_method_return_url: `${callbackUrl}/global_pay_method_notification`,
      },
    },
    {
      headers: headers(accessToken),
    }
  );

  if (response.status !== 200) {
    throw new BadRequestException("Failed to check enrollment");
  }

  return {
    ...response.data,
    status: response.data.three_ds.enrolled_status,
    liabilityShift: response.data.three_ds.liability_shift,
    authId: response.data.id,
    enrolled: response.data.three_ds.enrolled_status === "ENROLLED",
  };
}

async function handle_challenge_notification(data: ChallengeNotificationRequest) {
  const decoded = Buffer.from(data.cres, "base64").toString();
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

  const html = `
    <!DOCTYPE html>
    <html>
    <body>
    <script src="https://storage.googleapis.com/paylists-app-production.appspot.com/admin/global_pay_3ds_library.js"></script>
    <script>
        GlobalPayments.ThreeDSecure.handleChallengeNotification(${decoded},'https://${APP_DOMAIN}');
    </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

async function handle_method_notification(data: MethodNotificationRequest) {
  const decoded = Buffer.from(data.threeDSMethodData, "base64").toString();
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

  const html = `
    <!DOCTYPE html>
    <html>
    <body>
    <script src="https://storage.googleapis.com/paylists-app-production.appspot.com/admin/global_pay_3ds_library.js"></script>
    <script>
        GlobalPayments.ThreeDSecure.handleMethodNotification(${decoded},'https://${APP_DOMAIN}');
    </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

async function handle_initiate_authentication(data: InitiateAuthenticationRequest) {
  const paymentRequestData = await checkRequestBelongsToUser(
    data.userId,
    data.request.paymentRequestId
  );

  if (!paymentRequestData) {
    throw new ForbiddenException("Access denied");
  }

  if (paymentRequestData.payment_done || paymentRequestData.amountRemaining === 0) {
    throw new BadRequestException("Payment request is fully paid");
  }

  const globalPayService = await get_global_pay_service(paymentRequestData.vendorId);
  const accessToken = await globalPayGenerateAccessToken(
    globalPayService.app_id,
    globalPayService.app_key
  );

  const amountPence = amountToPence(data.request.amount);
  const response = await axios.post(
    `${baseUrl}/authentications/${data.versionCheckData.id}/initiate`,
    {
      three_ds: {
        source: "BROWSER",
        preference: "NO_PREFERENCE",
      },
      payment_method: {
        id: data.card.reference,
      },
      order: {
        time_created_reference: new Date(paymentRequestData.request_date).toISOString(),
        amount: amountPence,
        currency: data.request.currency,
        reference: paymentRequestData.id,
      },
      browser_data: {
        accept_header: "application/json",
        color_depth: "TWENTY_FOUR_BITS",
        ip: "127.0.0.1",
        java_enabled: false,
        javascript_enabled: true,
        language: 'en-US',
        screen_height: data.screen.height,
        screen_width: data.screen.width,
        challenge_window_size: data.challengeWindow.windowSize,
        timezone: data.timezone,
        user_agent: "Deno/1.0",
      },
      merchant_contact_url: data.request.requestUrl,
    },
    {
      headers: headers(accessToken),
    }
  );

  if (response.status !== 200) {
    throw new BadRequestException("Failed to initiate authentication");
  }

  return {
    acsTransactionId: response.data.three_ds.acs_trans_ref,
    authenticationSource: response.data.three_ds.authentication_source,
    dsTransactionId: response.data.three_ds.ds_trans_ref,
    liabilityShift: response.data.three_ds.liability_shift,
    challenge: {
      displayMode: "lightbox",
      encodedChallengeRequest: response.data.three_ds.challenge_value,
      requestUrl: response.data.three_ds.acs_challenge_request_url,
      messageType: response.data.three_ds.message_type,
      windowSize: data.challengeWindow.windowSize,
    },
    challengeMandated: response.data.three_ds.challenge_status,
    mpi: {
      authenticationValue: response.data.three_ds.authentication_value,
      eci: response.data.three_ds.eci,
    },
    messageCategory: response.data.three_ds.message_category,
    messageVersion: response.data.three_ds.message_version,
    serverTransactionId: response.data.three_ds.server_trans_ref,
    status: response.data.three_ds.status,
    statusReason: response.data.three_ds.status_reason,
  };
}

async function handle_process_card(data: any) {
  const { reqId, uid, authId, transId } = data;

  const request = await checkRequestBelongsToUser(uid, reqId);
  if (!request) {
    throw new ForbiddenException("Access denied");
  }

  if (request.payment_done || request.amountRemaining === 0) {
    throw new BadRequestException("Payment request is fully paid");
  }

  const globalPayService = await get_global_pay_service(request.vendorId);
  if (!globalPayService.app_key || !globalPayService.app_id) {
    throw new ForbiddenException("Access denied");
  }

  const accessToken = await globalPayGenerateAccessToken(
    globalPayService.app_id,
    globalPayService.app_key
  );

  if (!accessToken) {
    throw new BadRequestException("Invalid token");
  }

  const authResultResponse = await axios.get(
    `${baseUrl}/authentications/${authId}`,
    {
      headers: headers(accessToken),
    }
  );

  if (authResultResponse.status !== 200) {
    throw new BadRequestException("Failed to get authentication result");
  }

  const { amount, currency, country, payment_method, action } = authResultResponse.data;

  if (action.app_id !== globalPayService.app_id) {
    throw new ForbiddenException("Access denied");
  }

  const { three_ds, name } = payment_method;

  if (!["01", "02", "05", "06"].includes(three_ds.eci)) {
    throw new BadRequestException(
      "Cannot process the card. Authentication was not successful. Please try again."
    );
  }

  const transactionsResultResponse = await axios.post(
    `${baseUrl}/transactions`,
    {
      account_name: "transaction_processing",
      channel: "CNP",
      type: "SALE",
      amount: amount,
      currency: currency,
      reference: reqId,
      country: country,
      payment_method: {
        name,
        entry_mode: "ECOM",
        id: transId,
        authentication: {
          id: authId,
        },
      },
    },
    {
      headers: headers(accessToken),
    }
  );

  if (transactionsResultResponse.status !== 200) {
    throw new BadRequestException("Failed to process transaction");
  }

  if (
    transactionsResultResponse.data.status === "CAPTURED" ||
    transactionsResultResponse.data.status === "FUNDED"
  ) {
    transactionsResultResponse.data.amount = amountToPound(transactionsResultResponse.data.amount);
    await update_payment_request_after_payment(
      reqId,
      transactionsResultResponse.data.amount,
      PaymentServiceType.GlobalPay
    );
  }

  await createGlobalPayTransaction(reqId, transactionsResultResponse.data);
  return { status: "success" };
}

async function handle_refund(data: any) {
  const { reqId, uid, amount, transactionId } = data;

  const request = await checkRequestBelongsToUser(uid, reqId);
  if (!request) {
    throw new ForbiddenException("Access denied");
  }

  const globalPayService = await get_global_pay_service(request.vendorId);
  if (!globalPayService.app_key || !globalPayService.app_id) {
    throw new ForbiddenException("Access denied");
  }

  const accessToken = await globalPayGenerateAccessToken(
    globalPayService.app_id,
    globalPayService.app_key
  );

  if (!accessToken) {
    throw new BadRequestException("Invalid token");
  }

  const transactionsResponse = await axios.get(
    `${baseUrl}/transactions/${transactionId}`,
    { headers: headers(accessToken) }
  );

  if (transactionsResponse.status !== 200) {
    throw new BadRequestException("Invalid data");
  }

  const { status } = transactionsResponse.data;
  const amountPence = amountToPence(amount);

  const transactionsRefundResponse = await axios.post(
    `${baseUrl}/transactions/${transactionId}/${status === "CAPTURED" ? "reversal" : "refund"}`,
    { amount: amountPence },
    { headers: headers(accessToken) }
  );

  if (transactionsRefundResponse.status !== 200) {
    throw new BadRequestException("Failed to process refund");
  }

  transactionsRefundResponse.data.amount = amountToPound(transactionsRefundResponse.data.amount);

  const { data: paymentRequestData } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq('id', reqId)
    .single();

  if (!paymentRequestData) {
    throw new BadRequestException("Payment request not found");
  }

  const amountRemaining = Math.min(
    paymentRequestData.amountRemaining + Number(amount),
    paymentRequestData.amount
  );

  const updatedPaidAmount = Math.max(
    parseFloat(paymentRequestData.paid_amount) - Number(amount),
    0
  );

  await supabase
    .from(TABLES.DocumentHeader)
    .update({
      amountRemaining,
      paid_amount: updatedPaidAmount,
    })
    .eq('id', reqId);

  await createGlobalPayTransaction(reqId, transactionsRefundResponse.data);
  return { status: "success" };
}

async function handle_submit_application(data: any) {
  const { application, businessId } = data;

  const html = `<div style="font-size:18px">
    <div style="margin-bottom:8px">A new Global Payments application was submitted:</div>
    ${Object.entries(application)
      .map(([key, value]) => {
        return `<div style="margin-bottom:4px">${key}: ${value}</div>`;
      })
      .join(" ")}
    </div>`;

  const { data: staticData } = await supabase
    .from('static_data')
    .select('value')
    .eq('key', 'feedback_email')
    .single();

  if (!staticData) {
    throw new BadRequestException("Feedback email not found");
  }

  await send_email({
    to: staticData.value,
    subject: `Global Payments application for ${application.Email}`,
    html,
    business_name: "",
    senderBusinessName: "",
    replyTo: ""
  });

  await supabase
    .from('business_payment_services')
    .upsert({
      business_id: businessId,
      service_type: PaymentServiceType.GlobalPay,
      application_status: ApplicationStatus.SUBMITTED,
      app_id: "",
      app_key: "",
      merchant_id: "",
      submitted_date: new Date().toISOString()
    });

  return { status: "success" };
}
