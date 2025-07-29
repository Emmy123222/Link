import axios from "npm:axios";
import crypto from "npm:crypto";
import { supabase } from "../db.ts";
import { BadRequestException } from "../exceptions.ts";

// Payment service types and transaction types
export enum PaymentServiceType {
  GlobalPay = "globalpay"
}

export enum TransactionMethodUsed {
  CARD = "CARD"
}

export enum TransactionSummaryType {
  PAYMENT = "PAYMENT",
  REFUND = "REFUND"
}

export interface GlobalPayService {
  app_id: string;
  app_key: string;
  merchant_id: string;
}

export const headers = (accessToken?: string) => ({
  "Content-Type": "application/json",
  "X-GP-Version": "2021-03-22",
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

export const baseUrl = Deno.env.get("GLOBAL_PAY_URL")!;

export async function get_global_pay_service(businessId: string): Promise<GlobalPayService> {
  const { data: paymentService } = await supabase
    .from('business_payment_services')
    .select()
    .eq('business_id', businessId)
    .eq('service_type', PaymentServiceType.GlobalPay)
    .single();

  if (!paymentService) {
    throw new BadRequestException("Global Pay service not found for this business");
  }

  return paymentService as GlobalPayService;
}

export async function globalPayGenerateAccessToken(
  appId: string,
  appKey: string,
  isRestricted = false
) {
  try {
    const nonce = new Date().toISOString();
    // Creating hash object
    const hash = crypto.createHash("sha512");
    // Passing the data to be hashed
    const secret = hash.update(nonce + appKey, "utf-8").digest("hex");

    const data = {
      nonce,
      secret,
      app_id: appId,
      grant_type: "client_credentials",
      ...(isRestricted
        ? {
          permissions: ["PMT_POST_Create_Single"],
          interval_to_expire: "10_MINUTES",
          restricted_token: "YES",
        }
        : {}),
    };

    const response = await axios.post(`${baseUrl}/accesstoken`, data, {
      headers: headers(),
    });

    if (response.status === 200) {
      return response.data.token;
    }
    return null;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function createGlobalPayTransaction(
  reqId: string,
  transactionsResultData: any
) {
  const { payment_method, status, id, type, amount, currency, time_created } =
    transactionsResultData;

  const { error } = await supabase
    .from('document_transactions')
    .insert({
      document_id: reqId,
      created_at: time_created,
      amount: amount,
      currency: currency,
      status: status,
      method: TransactionMethodUsed.CARD,
      type: type === "SALE"
        ? TransactionSummaryType.PAYMENT
        : TransactionSummaryType.REFUND,
      service: PaymentServiceType.GlobalPay,
      metadata: {
        transaction_id: id,
        card_info: payment_method?.card || {},
        original_status: status,
      },
    });

  if (error) {
    throw new BadRequestException("Failed to create transaction");
  }
}

export const camelizeKeys = function (dataObj: any) {
  return JSON.parse(JSON.stringify(dataObj).trim().replace(/("\w+":)/g, function (keys) {
    return keys.replace(/(.(\_|-|\s)+.)/g, function (subStr) {
      return subStr[0] + (subStr[subStr.length - 1].toUpperCase());
    });
  }));
};

// GlobalPay use "pence" and not pound so this converts amount to pence
export const amountToPence = (amount: any) => (Number(amount) * 100).toString();

export const amountToPound = (amount: any) => (Number(amount) / 100).toString();
