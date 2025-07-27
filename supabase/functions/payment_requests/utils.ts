import _ from "npm:lodash";
import { supabase } from "../config.ts";
import { TABLES } from "../db.ts";
import { fetchHTML } from "../email_sending/index.ts";
import { ForbiddenException } from "../exceptions.ts";
import { PaymentServiceType } from "../types/payments.ts";
import { TaxText } from "../types/tax-option.ts";
import { getUserActivePlans } from "../user/user_utils.ts";
import { CurrencyFormatter } from "../utils.ts";
import { createLog } from "./changesLog.ts";
import { PAYMENT_DOCUMENT_TYPES } from "./paymentRequests.constants.ts";

export const isGuestUser = async (req, uid: string) => {
  if (req.guest_user === uid) {
    return true;
  }

  const { data: businesses, error } = await supabase
    .from(TABLES.Business)
    .select()
    .eq('email', req.email_to_verify)
    .not('owner_id', 'is', null);

  if (error) {
    console.error('Error checking guest user:', error);
    return false;
  }

  return businesses.length === 0;
};

export async function update_payment_request_after_payment(
  paymentRequestId: string,
  paidAmount: string,
  paymentService: PaymentServiceType
) {
  const { data: paymentRequestData, error: fetchError } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq('id', paymentRequestId)
    .single();

  if (fetchError) {
    throw new Error('Failed to fetch payment request');
  }

  const amountRemaining = paymentRequestData.amountRemaining - parseFloat(paidAmount);
  const paymentDone = amountRemaining === 0;

  let updatedPaidAmount;
  if (paymentRequestData.paid_amount) {
    updatedPaidAmount = parseFloat(paymentRequestData.paid_amount) + parseFloat(paidAmount);
  } else {
    updatedPaidAmount = parseFloat(paidAmount);
  }

  if (amountRemaining < 0 || updatedPaidAmount > parseFloat(paymentRequestData.amount)) {
    return Promise.reject("Payment request is fully paid");
  }

  const { error: updateError } = await supabase
    .from(TABLES.DocumentHeader)
    .update({
      payment_method: paymentService === PaymentServiceType.GlobalPay ? "Debit / Credit card" : "Open banking",
      payment_service_provider: paymentService,
      amountRemaining: amountRemaining,
      paid_amount: updatedPaidAmount,
      payment_done: paymentDone,
    })
    .eq('id', paymentRequestId);

  if (updateError) {
    throw new Error('Failed to update payment request');
  }

  // Update user's active plan (decrement transactions number)
  if (paymentService === PaymentServiceType.Crezco) {
    const userActivePlans = await getUserActivePlans(paymentRequestData.vendorOwnerId);
    if (userActivePlans.length > 0) {
      const activeWithTransactions = userActivePlans.filter(
        (up) => up.transactions && up.transactions > 0
      );
      if (activeWithTransactions.length > 0) {
        const orderedByDate = _.orderBy(activeWithTransactions, "created_date", "asc");
        const { error: planUpdateError } = await supabase
          .from(TABLES.UserPlan)
          .update({ transactions: orderedByDate[0].transactions - 1 })
          .eq('id', orderedByDate[0].id);

        if (planUpdateError) {
          console.error('Failed to update user plan:', planUpdateError);
        }
      }
    }
  }

  if (amountRemaining === 0) {
    const logContent = paymentService === PaymentServiceType.GlobalPay
      ? `Payment completed by a card`
      : "Payment completed by a bank account";

    await createLog({
      change: {
        business_id: paymentRequestData.customerId,
        content: logContent,
        type: constants.logs.messageTypes.info,
      },
      reqId: paymentRequestId,
    });
  }
}

export async function checkRequestBelongsToUser(uid: string, reqId: number) {
  const { data: paymentRequest, error } = await supabase
    .from(TABLES.DocumentHeader)
    .select('*')
    .eq('id', reqId)
    .single();

    if (error) {
    throw new Error(error.message);
  }
  if (
    uid !== paymentRequest.vendor_owner_id &&
    uid !== paymentRequest.customer_owner_id &&
    uid !== paymentRequest.guest_user
  ) {
    throw new ForbiddenException("User does not have access to this request");
  }
  return paymentRequest;
}

export async function fetchHtmlForRequest(paymentRequest: any, userMessage: any, requestUrl: any, customerId: any, vendorId: any, dates: any) {
  const { data: customer, error: customerError } = await supabase.from(TABLES.Business).select("*, country:countryCode(countryName)").eq('id', customerId).single();
  const { data: vendor, error: vendorError } = await supabase.from(TABLES.Business).select("*, country:countryCode(countryName)").eq('id', vendorId).single();
  if (customerError || vendorError) {
    console.error('Error fetching customer or vendor:', customerError || vendorError);
  }
  let items = "";
  const itemFields = [
    "name",
    "quantity",
    "price",
    "tax",
    "amount",
    "vat",
    "totalAmount",
  ];
  if (paymentRequest.items && paymentRequest.items.length > 0) {
    items += "<tr>";
    paymentRequest.items.forEach((item: any) => {
      itemFields.forEach((itemKey) => {
        items += `<td class="v-container-padding-padding"
        style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 5px 15px;font-family:'Montserrat',sans-serif;"
        align="left">

        <div class="v-color v-text-align"
          style="font-size: 14px; color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;">
          <p style="font-size: 14px; line-height: 140%;"><span
              style="font-size: 18px; line-height: 25.2px;"><strong>${itemKey === "tax" ? TaxText[item[itemKey]] : item[itemKey]
          }</strong></span>
          </p>
        </div>

      </td>`;
      });
    });
    items += "</tr>";
  }
  const vendorBank =
    vendor.bank_accounts && vendor.bank_accounts.length > 0
      ? vendor.bank_accounts[0]
      : null;

  return fetchHTML(
    paymentRequest.items
      ? "payment_request_customer_email_with_items"
      : "payment_request_customer_email",
    [
      {
        patternToReplace: "%%user_message%%",
        replaceWith: userMessage,
      },
      {
        patternToReplace: "%%vendor_name%%",
        replaceWith: vendor.business_name,
      },
      {
        patternToReplace: "%%vendor_email%%",
        replaceWith: vendor.email,
      },
      {
        patternToReplace: "%%vendor_phone%%",
        replaceWith: vendor.mobile_phone_number,
      },
      {
        patternToReplace: "%%mobile_code_area%%",
        replaceWith: vendor.mobile_code_area,
      },
      {
        patternToReplace: "%%vendor_city%%",
        replaceWith: vendor.city,
      },
      {
        patternToReplace: "%%vendor_country%%",
        replaceWith: vendor.country.countryName,
      },
      {
        patternToReplace: "%%vendor_street_1%%",
        replaceWith: vendor.street_1,
      },
      {
        patternToReplace: "%%vendor_postal_code%%",
        replaceWith: vendor.postal_code,
      },
      {
        patternToReplace: "%%vendor_vat%%",
        replaceWith: vendor.vat_number ? `VAT: ${vendor.vat_number}` : " ",
      },
      {
        patternToReplace: "%%vendor_registration%%",
        replaceWith: vendor.registration_number
          ? `Registration number: ${vendor.registration_number}`
          : " ",
      },
      {
        patternToReplace: "%%vendor_bank_account%%",
        replaceWith: vendorBank
          ? `Bank account name: ${vendorBank.bank_account_name}`
          : " ",
      },
      {
        patternToReplace: "%%vendor_bank_number%%",
        replaceWith: vendorBank
          ? `Bank account number: ${vendorBank.bank_account_number}`
          : " ",
      },
      {
        patternToReplace: "%%vendor_sort_code%%",
        replaceWith: vendorBank ? `Sort code: ${vendorBank.sort_code}` : " ",
      },

      {
        patternToReplace: "%%customer_name%%",
        replaceWith: customer.business_name,
      },
      {
        patternToReplace: "%%customer_email%%",
        replaceWith: customer.email,
      },
      {
        patternToReplace: "%%customer_phone%%",
        replaceWith: customer.mobile_phone_number,
      },
      {
        patternToReplace: "%%customer_city%%",
        replaceWith: customer.city,
      },
      {
        patternToReplace: "%%customer_country%%",
        replaceWith: customer.country.countryName,
      },
      {
        patternToReplace: "%%customer_street_1%%",
        replaceWith: customer.street_1,
      },
      {
        patternToReplace: "%%customer_postal_code%%",
        replaceWith: customer.postal_code,
      },
      {
        patternToReplace: "%%document_link%%",
        replaceWith: requestUrl,
      },
      {
        patternToReplace: "%%document_type%%",
        replaceWith: paymentRequest.document_type.toLowerCase(),
      },
      {
        patternToReplace: "%%document_type_upper%%",
        replaceWith: paymentRequest.document_type.toUpperCase(),
      },
      {
        patternToReplace: "%%document_id%%",
        replaceWith: `${paymentRequest.document_type === PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST ? "PR" : "INV"
          }${paymentRequest.document_number}`,
      },
      {
        patternToReplace: "%%paid_so_far%%",
        replaceWith: `${CurrencyFormatter[paymentRequest.currency].format(
          paymentRequest.paid_amount || 0
        )}`,
      },
      {
        patternToReplace: "%%remaining%%",
        replaceWith: `${CurrencyFormatter[paymentRequest.currency].format(
          paymentRequest.amount - paymentRequest.paid_amount
        )}`,
      },
      {
        patternToReplace: "%%total%%",
        replaceWith: `${CurrencyFormatter[paymentRequest.currency].format(
          paymentRequest.amount
        )}`,
      },
      {
        patternToReplace: "%%amount%%",
        replaceWith: `${CurrencyFormatter[paymentRequest.currency].format(
          paymentRequest.amount
        )}`,
      },
      paymentRequest.description && !paymentRequest.items
        ? {
          patternToReplace: "%%description%%",
          replaceWith: paymentRequest.description,
        }
        : {
          patternToReplace: "%%items%%",
          replaceWith: items,
        },
      {
        patternToReplace: "%%request_date%%",
        replaceWith: dates.requestDate,
      },
      {
        patternToReplace: "%%supply_date%%",
        replaceWith: dates.supplyDate,
      },
      {
        patternToReplace: "%%due_date%%",
        replaceWith: dates.dueDate,
      },
      {
        patternToReplace: "%%vendor_image%%",
        replaceWith: vendor.img_url || "",
      },
      {
        patternToReplace: "%%request_terms%%",
        replaceWith: paymentRequest.terms
          ? `Terms & conditions: ${paymentRequest.terms}`
          : " ",
      },
      {
        patternToReplace: "%%request_note%%",
        replaceWith: paymentRequest.note
          ? `Note: ${paymentRequest.note}`
          : " ",
      },
    ]
  );
}
