// deno-lint-ignore-file no-async-promise-executor no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requests } from "../constants.ts";
import { supabase } from "../db.ts";
import {
  handleException,
  MethodNotAllowedException,
  NotFoundException,
} from "../exceptions.ts";
import { Business } from "../types/business.ts";
import { DocumentHeader, TransactionMethodUsed } from "../types/payments.ts";

const businessesToIgnore = [
  "OwpUq2KjVEJoBLJLxulB",
  "QAWORFSqWdkTNIUKdAHE",
  "bzPKZFFK9E2CvZrn6CJz",
  "e4lOXoUlq254huwR05wk",
];

Deno.serve((req) =>
  handleException(async () => {
    const { operation } = await req.json();

    if (req.method == "POST") {
      switch (operation) {
        case "get_system_summary":
          return get_system_summary();
      }
      throw new NotFoundException();
    }
    throw new MethodNotAllowedException();
  })
);

const get_system_summary = async () => {
  let { data: businesses } = await supabase
    .from("Businesses")
    .select()
    .neq("is_deleted", true);

  const { data: paymentRequests } = await supabase
    .from("Document_header")
    .select();

  businesses = businesses!.filter(
    (b: Business) => !businessesToIgnore.includes(b.id)
  );

  const result: Record<string, any> = {};
  await Promise.all(
    businesses.map((business: Business) => {
      result[business.id] = {
        business_name: business.business_name,
        total_amount: 0,
        paid_amount: 0,
        paid_transactions: 0,
        payment_requests: 0,
        address: `${business.street_1}, ${business.city}`,
      };
    })
  );
  await Promise.all(
    paymentRequests!.map((paymentRequest: DocumentHeader) => {
      return new Promise(async (resolve) => {
        if (result[paymentRequest.vendorId]) {
          let { data: transactions } = await supabase
            .from("Document transactions")
            .select()
            .eq("header_id", paymentRequest.id);

          transactions = transactions!.filter(
            (trans: any) => trans.status === "SUCCESSFUL"
          );

          result[paymentRequest.vendorId].total_amount += paymentRequest.amount;
          result[paymentRequest.vendorId].paid_amount +=
            paymentRequest.status === requests.statuses.closed
              ? paymentRequest.amount
              : paymentRequest.paid_amount || 0;
          result[paymentRequest.vendorId].paid_transactions +=
            transactions.reduce((res: number, trans: any) => {
              if (trans.method !== TransactionMethodUsed.REPORTED_VIA_XERO) {
                return res + Number(trans.amount);
              } else {
                return res;
              }
            }, 0);
          result[paymentRequest.vendorId].payment_requests++;
        }
        resolve(true);
      });
    })
  );

  return Object.values(result);
};
