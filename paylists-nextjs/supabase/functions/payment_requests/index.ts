import { requireAuth } from "../auth/authMiddleware.ts";
import {
  check_if_business_belongs_to_userId,
  create_verification_code_for_payment_request,
} from "../business/business_helper.ts";
import { supabase } from "../config.ts";
import { requests } from "../constants.ts";
import { TABLES } from "../db.ts";
import { fetchHTML, send_email } from "../email_sending/index.ts";
import {
  BadRequestException,
  handleException,
  MethodNotAllowedException,
  NotFoundException,
  ForbiddenException,
} from "../exceptions.ts";
import { send_sms } from "../sms_sending/index.ts";
import { createGuestUser } from "../user/user_utils.ts";
import { createLog } from "./changesLog.ts";
import {
  handle_req_change,
  shouldUpdateOnChange,
} from "./paymentRequests.utils.ts";
import { checkRequestBelongsToUser, fetchHtmlForRequest } from "./utils.ts";
import { BusinessType } from "../types/business.ts";

// Helper function to check if business is personal type
function isPersonalBusinessType(businessType: string): boolean {
  return businessType === BusinessType.PERSONAL;
}

const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

const INITIAL_NUMBERS = {
  PAYMENT_REQUEST_TYPE: 10000000,
  INVOICE_TYPE: 20000000,
  PLANNING_TYPE: 30000000,
  PURCHASE_INVOICE_TYPE: 40000000,
};

const PAYMENT_DOCUMENT_TYPES = {
  PAYMENT_REQUEST: "Payment request",
  INVOICE: "Invoice",
  PLANNING: "Planning Payment",
  PURCHASE_INVOICE: "Bill",
};

// Document number formatting function
const formatDocumentNumber = (documentType: string, number: number): string => {
  const paddedNumber = number.toString().padStart(8, "0");

  switch (documentType) {
    case PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST:
      return `PR${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.INVOICE:
      return `INV${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.PLANNING:
      return `PLN${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE:
      return `BIL${paddedNumber}`;
    default:
      return paddedNumber;
  }
};

interface LetterData {
  letterBase64: string;
  letterName: string;
}

interface LatePaymentLetterData {
  debtorDetails: {
    email: string;
    business_name: string;
  };
  requestBusinessDetails: {
    business_name: string;
    email: string;
  };
  reqId: string;
  businessId: string;
  letterUrl: string;
  letterName: string;
  letterTemplate?: string;
}

Deno.serve((req) => {
  return handleException(async () => {
    console.log(req.method);
    if (req.method === "OPTIONS") return null;

    if (req.method === "POST") {
      const { action, data } = await req.json();

      switch (action) {
        case "create_payment_request_to_receive":
          return handle_create_payment_request_to_receive(req, data);
        case "create_payment_request_to_pay":
          return handle_create_payment_request_to_pay(req, data);
        case "delete_payment_req":
          return handle_delete_payment_req(req, data);
        case "delete_draft_document":
          return handle_delete_draft_document(req, data);
        case "cancel_open_document":
          return handle_cancel_open_document(req, data);
        case "update_opened_by":
          return handle_update_opened_by(req, data);
        case "update_payment_request_for_vendor":
          return handle_update_payment_request_for_vendor(req, data);
        case "update_payment_request":
          return handle_update_payment_request(req, data);
        case "close_req":
          return handle_close_req(req, data);
        case "late_payment_req":
          return handle_late_payment_req(req, data);
        case "dispute_req":
          return handle_dispute_req(req, data);
        case "set_req_done":
          return handle_set_req_done(req, data);
        case "reopen_req":
          return handle_reopen_req(req, data);
        case "send_payment_request_to_customer":
          return handle_send_payment_request_to_customer(req, data);
        case "get_payment_request_link":
          return handle_get_payment_request_link(req, data);
        case "send_payment_request_to_vendor":
          return handle_send_payment_request_to_vendor(req, data);
        case "get_req_for_unAuthenticated_user":
          return handle_get_req_for_unAuthenticated_user(req, data);
        case "get_request":
          return handle_get_request(req, data);
        case "send_sms_from_chat":
          return handle_send_sms_from_chat(req, data);
        case "send_email_from_chat":
          return handle_send_email_from_chat(req, data);
        case "get_request_payments_status":
          return handle_get_request_payments_status(req, data);
        case "mark_document_as_open":
          return handle_mark_document_as_open(req, data);
        case "log_late_payment_letter":
          return handle_log_late_payment_letter(
            req,
            data as LatePaymentLetterData
          );
        case "log_letter":
          return handle_log_letter(req, data as LatePaymentLetterData);
        default:
          throw new BadRequestException(`Unknown action: ${action}`);
      }
    }
    throw new MethodNotAllowedException();
  });
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(",")[1]; // Remove the "data:..." prefix
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function handle_log_late_payment_letter(
  req: Request,
  {
    debtorDetails,
    requestBusinessDetails,
    reqId,
    businessId,
    userId,
    letterUrl,
    letterName,
    letterTemplate = "default",
  }: LatePaymentLetterData
) {
  const { supabase, user } = await requireAuth(req);
  await createLog({
    change: {
      sender_id: user.id,
      request_id: Number(reqId),
      message: letterUrl,
      type: "late_payment",
    },
  });
  const { data: letterData, error: storageError } = await supabase.storage
    .from("documents")
    .download(`${letterName}`);
  if (storageError) throw new BadRequestException(storageError.message);
  const base64Data = await blobToBase64(letterData);
  try {
    const html = await fetchHTML("late_payment", [
      {
        patternToReplace: "%%business%%",
        replaceWith: requestBusinessDetails.business_name,
      },
    ]);
    await send_email({
      to: debtorDetails.email,
      subject: `Late payment`,
      html,
      replyTo: requestBusinessDetails.email,
      business_name: debtorDetails.business_name,
      senderBusinessName: requestBusinessDetails.business_name,
      attachments: [
        {
          content: base64Data,
          filename: "Late payment.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
  return { success: true };
}

async function handle_log_letter(
  req: Request,
  {
    debtorDetails,
    requestBusinessDetails,
    reqId,
    businessId,
    userId,
    letterUrl,
    letterName,
    letterTemplate = "default",
  }: LatePaymentLetterData
) {
  const { supabase, user } = await requireAuth(req);
  await createLog({
    change: {
      sender_id: user.id,
      request_id: Number(reqId),
      message: letterUrl,
      type: "letter",
    },
  });
  const { data: letterData, error: storageError } = await supabase.storage
    .from("documents")
    .download(`${letterName}`);
  if (storageError) throw new BadRequestException(storageError.message);
  return { success: true };
}

async function handle_create_payment_request_to_receive(
  req: Request,
  data: { paymentReq: any; businessId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;
  const { paymentReq, businessId } = data;

  const belongsToUser = await check_if_business_belongs_to_userId(
    userId,
    businessId
  );
  if (!belongsToUser) throw new ForbiddenException();

  // Get business details to check if it's a personal business
  const { data: business, error: businessError } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    throw new Error("Business not found");
  }

  // Check if this is a personal business trying to send payment requests
  if (isPersonalBusinessType(business.business_type)) {
    throw new ForbiddenException(
      "Personal accounts cannot send payment requests or invoices. Please create a business account to access this feature."
    );
  }

  // Get business and customer details
  const { data: customer } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentReq.customer_id)
    .single();
  if (!customer) throw new BadRequestException("Customer not found");
  // Generate document number
  let docNumber = "";
  let nextNumber = 0;

  if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST) {
    nextNumber =
      business.request_number || INITIAL_NUMBERS.PAYMENT_REQUEST_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ request_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.INVOICE) {
    nextNumber = business.invoice_number || INITIAL_NUMBERS.INVOICE_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.INVOICE,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ invoice_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PLANNING) {
    nextNumber = business.planning_number || INITIAL_NUMBERS.PLANNING_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PLANNING,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ planning_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (
    paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE
  ) {
    nextNumber = business.bill_number || INITIAL_NUMBERS.PURCHASE_INVOICE_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ bill_number: nextNumber + 1 })
      .eq("id", businessId);
  }
  // Handle guest users
  const privateOrNotVerifiedBusiness = customer.email || !customer.owner_id;
  const guestUserId = privateOrNotVerifiedBusiness
    ? await createGuestUser(customer.email)
    : null;

  const { data: paymentRequest, error } = await supabase
    .from(TABLES.DocumentHeader)
    .insert({
      vendor_id: businessId,
      vendor_owner_id: userId,
      customer_id: customer.id,
      created_by_business: businessId,
      created_by: userId,
      customer_owner_id: customer.ownerId,
      status: requests.statuses.DRAFT,
      amount: paymentReq.amount,
      currency: paymentReq.currency,
      due_date: new Date(paymentReq.due_date),
      document_type: paymentReq.document_type,
      document_number: docNumber,
      description: paymentReq.description,
      payment_request_tax: paymentReq.payment_request_tax,
      payment_terms: paymentReq.payment_terms,
      remainder: paymentReq.remainder,
      reference_number: paymentReq.reference_number,
      attachments: paymentReq.attachments,
      supply_date: new Date(paymentReq.supply_date),
      request_date: new Date(paymentReq.request_date),
      guest_user: guestUserId,
      partial_payments: paymentReq.partial_payments,
      terms: paymentReq.terms,
      note: paymentReq.note,
      opened_by: [{ businessId, opened_date: Date.now() }],
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  // Create items if they exist
  if (paymentReq.items && paymentReq.items.length > 0) {
    const items = paymentReq.items.map((item: any) => ({
      document_header_id: paymentRequest.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.amount,
      tax_rate: item.tax_rate,
      tax_amount: item.tax_amount,
    }));
    const { error: itemsError } = await supabase
      .from(TABLES.DocumentItems)
      .insert(items);
    if (itemsError) throw new Error(itemsError.message);
  }

  const messageContent = [
    `New ${paymentReq.document_type.toLowerCase()} created`,
    `Due date: ${formatDate(paymentReq.due_date)}`,
    `Supply date: ${formatDate(paymentReq.supply_date)}`,
    `Request date: ${formatDate(paymentReq.request_date)}`,
    `Amount: ${paymentReq.amount}`,
  ].join("\n");
  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: messageContent,
      type: "created",
    },
  });
  return { success: true, reqId: paymentRequest.id };
}

async function handle_create_payment_request_to_pay(
  req: Request,
  { paymentReq, businessId }: { paymentReq: any; businessId: number }
) {
  // Verify user and business
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;
  const businessBelongsToUser = await check_if_business_belongs_to_userId(
    userId,
    businessId
  );
  if (!businessBelongsToUser)
    throw new BadRequestException("Business does not belong to user");

  // Get business and vendor details
  const { data: business } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", businessId)
    .single();

  const { data: vendor } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentReq.vendorId)
    .single();

  if (!business || !vendor)
    throw new BadRequestException("Business or vendor not found");
  // Generate document number
  let docNumber = "";
  let nextNumber = 0;

  if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST) {
    nextNumber =
      business.request_number || INITIAL_NUMBERS.PAYMENT_REQUEST_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ request_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.INVOICE) {
    nextNumber = business.invoice_number || INITIAL_NUMBERS.INVOICE_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.INVOICE,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ invoice_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PLANNING) {
    nextNumber = business.planning_number || INITIAL_NUMBERS.PLANNING_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PLANNING,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ planning_number: nextNumber + 1 })
      .eq("id", businessId);
  } else if (
    paymentReq.document_type === PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE
  ) {
    nextNumber = business.bill_number || INITIAL_NUMBERS.PURCHASE_INVOICE_TYPE;
    docNumber = formatDocumentNumber(
      PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE,
      nextNumber
    );
    await supabase
      .from(TABLES.Business)
      .update({ bill_number: nextNumber + 1 })
      .eq("id", businessId);
  }
  // Create payment request
  const { data: paymentRequest, error } = await supabase
    .from(TABLES.DocumentHeader)
    .insert({
      vendor_id: paymentReq.vendorId,
      vendor_owner_id: vendor.owner_id,
      customer_id: businessId,
      customer_owner_id: userId,
      status: requests.statuses.DRAFT,
      amount: paymentReq.amount,
      currency: paymentReq.currency,
      due_date: paymentReq.due_date,
      document_type: paymentReq.document_type,
      document_number: docNumber,
      description: paymentReq.description,
      tax_text: paymentReq.tax_text,
      tax_amount: paymentReq.tax_amount,
      remainder: paymentReq.remainder,
      reference_number: paymentReq.reference_number,
      attachments: paymentReq.attachments,
      supply_date: paymentReq.supply_date,
      request_date: paymentReq.request_date,
      partial_payments: paymentReq.partial_payments,
      terms: paymentReq.terms,
      note: paymentReq.note,
      opened_by: [{ businessId, opened_date: Date.now() }],
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create items if they exist
  if (paymentReq.items && paymentReq.items.length > 0) {
    const items = paymentReq.items.map((item: any) => ({
      document_header_id: paymentRequest.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      created_by: userId,
      amount: item.amount,
      tax_rate: item.tax_rate,
      tax_amount: item.tax_amount,
    }));

    const { error: itemsError } = await supabase
      .from(TABLES.DocumentItems)
      .insert(items);

    if (itemsError) throw new Error(itemsError.message);
  }

  const messageContent = [
    `New ${paymentReq.document_type.toLowerCase()} created`,
    `Amount: ${paymentReq.amount}`,
    `Due date: ${formatDate(paymentReq.due_date)}`,
    `Supply date: ${formatDate(paymentReq.supply_date)}`,
    `Request date: ${formatDate(paymentReq.request_date)}`,
  ].join("\n");

  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: messageContent,
      type: "created",
    },
  });

  return { success: true, reqId: paymentRequest.id };
}

async function handle_delete_payment_req(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  const businessBelongsToUser = await check_if_business_belongs_to_userId(
    userId,
    paymentRequest.vendor_id
  );

  if (!businessBelongsToUser)
    throw new BadRequestException("Business does not belong to user");
  const { error: itemsError } = await supabase
    .from(TABLES.DocumentItems)
    .delete()
    .eq("document_header_id", reqId);

  if (itemsError) throw new Error(itemsError.message);

  const { error: changesLogError } = await supabase
    .from(TABLES.DocumentTransactions)
    .delete()
    .eq("header_id", reqId);
  if (changesLogError) throw new Error(changesLogError.message);

  // Delete payment request
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .delete()
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Delete associated items

  return { success: true };
}

// Phase 2: Delete Draft Document - Only allow deletion if status is 'Draft'
async function handle_delete_draft_document(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request (must be vendor)
  const businessBelongsToUser = await check_if_business_belongs_to_userId(
    userId,
    paymentRequest.vendor_id
  );

  if (!businessBelongsToUser)
    throw new ForbiddenException(
      "You don't have permission to delete this document"
    );

  // Business rule: Can only delete if status is 'Draft'
  if (paymentRequest.status !== "Draft") {
    throw new BadRequestException(
      "Can only delete documents with 'Draft' status. Current status: " +
        paymentRequest.status
    );
  }

  // Soft delete: Mark as deleted instead of hard delete
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({
      status: "Deleted",
      wasDeleted: true,
      updated_by: userId,
      changes_log: [
        ...(paymentRequest.changes_log || []),
        {
          action: "deleted",
          user: userId,
          timestamp: new Date().toISOString(),
          reason: "Draft document deleted by vendor",
          previous_status: paymentRequest.status,
        },
      ],
    })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Create audit log
  await createLog({
    change: {
      sender_id: userId,
      request_id: reqId,
      message: `Document deleted - was in Draft status`,
      type: "delete",
    },
  });

  return { success: true, message: "Draft document deleted successfully" };
}

// Phase 2: Cancel Open Document - Only allow cancellation if status is 'Open' and no payments received
async function handle_cancel_open_document(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request (must be vendor)
  const businessBelongsToUser = await check_if_business_belongs_to_userId(
    userId,
    paymentRequest.vendor_id
  );

  if (!businessBelongsToUser)
    throw new ForbiddenException(
      "You don't have permission to cancel this document"
    );

  // Business rule: Can only cancel if status is 'Open'
  if (paymentRequest.status !== "Open") {
    throw new BadRequestException(
      "Can only cancel documents with 'Open' status. Current status: " +
        paymentRequest.status
    );
  }

  // Business rule: Can only cancel if no payments received (paid_amount = 0)
  if (paymentRequest.paid_amount > 0) {
    throw new BadRequestException(
      `Cannot cancel document: payments received (${paymentRequest.paid_amount}). Must be 0 to cancel.`
    );
  }

  // Cancel: Mark as cancelled
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({
      status: "Cancelled",
      updated_by: userId,
      changes_log: [
        ...(paymentRequest.changes_log || []),
        {
          action: "cancelled",
          user: userId,
          timestamp: new Date().toISOString(),
          reason: "Open document cancelled by vendor (no payments received)",
          previous_status: paymentRequest.status,
          paid_amount_at_cancellation: paymentRequest.paid_amount,
        },
      ],
    })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Create audit log
  await createLog({
    change: {
      sender_id: userId,
      request_id: reqId,
      message: `Document cancelled - was Open with no payments received`,
      type: "cancel",
    },
  });

  return { success: true, message: "Open document cancelled successfully" };
}

async function handle_update_opened_by(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update opened_by
  const openedBy = paymentRequest.opened_by || [];
  const existingIndex = openedBy.findIndex(
    (entry: any) => entry.businessId === paymentRequest.vendor_id
  );

  if (existingIndex >= 0) {
    openedBy[existingIndex].opened_date = Date.now();
  } else {
    openedBy.push({
      businessId: paymentRequest.vendor_id,
      opened_date: Date.now(),
    });
  }

  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ opened_by: openedBy })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  return { success: true };
}

async function handle_update_payment_request_for_vendor(
  req: Request,
  { updates, paymentRequestId }: { updates: any; paymentRequestId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;
  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", paymentRequestId)
    .single();
  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");
  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequestId);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");
  // Update payment request
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({
      ...updates,
    })
    .eq("id", paymentRequestId);
  if (error) throw new Error(error.message);
  await handle_req_change({
    changerId: userId,
    req: {
      id: paymentRequestId as any,
      customerId: paymentRequest.customer_id,
      vendorId: paymentRequest.vendor_id,
      document_type: paymentRequest.document_type,
    },
  });

  const updatesArray = Object.entries(updates).map(
    ([key, value]) => `${key}: ${value}`
  );
  const messageContent = [`Vendor Updated`, ...updatesArray].join("\n");
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequestId,
      message: messageContent,
      type: "update",
    },
  });
  return { success: true };
}

async function handle_update_payment_request(
  req: Request,
  {
    updates,
    paymentRequestId,
    doNotNotify,
  }: { updates: any; paymentRequestId: number; doNotNotify: boolean }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;
  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", paymentRequestId)
    .single();
  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequestId);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");
  // Update payment request
  const { items, ...rest } = updates;
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update(rest)
    .eq("id", paymentRequestId);

  if (error) throw new Error(error.message);
  // Create log if needed
  if (shouldUpdateOnChange(doNotNotify, paymentRequest)) {
    await handle_req_change({
      changerId: userId,
      req: {
        id: paymentRequestId as any,
        customerId: paymentRequest.customer_id,
        vendorId: paymentRequest.vendor_id,
        document_type: paymentRequest.document_type,
      },
    });
  }

  if (items && items.length > 0) {
    items.forEach(async (item: any) => {
      item.document_header_id = paymentRequest.id;
      if (item.id) {
        const { data, id } = item;
        const { error: itemError } = await supabase
          .from(TABLES.DocumentItems)
          .update(data)
          .eq("id", id);
        if (itemError) throw new Error(itemError.message);
      } else {
        const { error: itemError } = await supabase
          .from(TABLES.DocumentItems)
          .insert(item);
        if (itemError) throw new Error(itemError.message);
      }
    });

    const { error: itemsError } = await supabase
      .from(TABLES.DocumentHeader)
      .update({
        amount: items.reduce((acc: number, item: any) => acc + item.amount, 0),
      })
      .eq("id", paymentRequest.id);
    if (itemsError) throw new Error(itemsError.message);
  }
  const messageContent = [
    `Updated`,
    `Amount: ${updates.amount}`,
    `Due date: ${formatDate(updates.due_date)}`,
    `Supply date: ${formatDate(updates.supply_date)}`,
    `Request date: ${formatDate(updates.request_date)}`,
  ].join("\n");
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequestId,
      message: messageContent,
      type: "update",
    },
  });

  return { success: true };
}

async function handle_close_req(req: Request, { reqId }: { reqId: number }) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({
      status: requests.statuses.CLOSED,
      payment_done: true,
    })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  const messageContent = doNotNotify
    ? [
        `Payment method updated to ${updates.payment_method}`,
        `Promise date updated to ${formatDate(paymentRequest.plan_due_date)}`,
      ]
    : [
        `${paymentRequest.document_type.toLowerCase()} closed`,
        `Amount: ${paymentReq.amount} ${paymentReq.currency}`,
        `Due date: ${formatDate(paymentReq.due_date)}`,
        `Reference number: ${paymentReq.reference_number}`,
        `Description: ${paymentReq.description}`,
        `Payment terms: ${paymentReq.payment_terms}`,
        `Remainder: ${paymentReq.remainder}`,
        `Tax text: ${paymentReq.tax_text}`,
        `Tax amount: ${paymentReq.tax_amount}`,
        `Attachments: ${paymentReq.attachments}`,
        `Supply date: ${formatDate(paymentReq.supply_date)}`,
        `Request date: ${formatDate(paymentReq.request_date)}`,
      ].join("\n");

  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: messageContent,
      type: "info",
    },
  });

  return { success: true };
}

async function handle_late_payment_req(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ status: requests.statuses.LATE_PAYMENT })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Generate and send late payment letter
  const letter = await generate_late_payment_letter(paymentRequest);
  await log_late_payment_letter({
    reqId,
    letter,
    userId,
    businessId: paymentRequest.vendor_id,
  });

  const messageContent = [
    `Late payment letter sent`,
    `Amount: ${paymentReq.amount} ${paymentReq.currency}`,
    `Due date: ${formatDate(paymentReq.due_date)}`,
    `Reference number: ${paymentReq.reference_number}`,
    `Description: ${paymentReq.description}`,
    `Payment terms: ${paymentReq.payment_terms}`,
    `Remainder: ${paymentReq.remainder}`,
    `Attachments: ${paymentReq.attachments}`,
    `Supply date: ${formatDate(paymentReq.supply_date)}`,
    `Request date: ${formatDate(paymentReq.request_date)}`,
  ].join("\n");
  // // Create log
  await createLog({
    change: {
      sender_id: paymentRequest.vendor_id,
      request_id: paymentRequest.id,
      message: messageContent,
      type: "late_payment",
    },
  });

  return { success: true };
}

async function handle_dispute_req(req: Request, { reqId }: { reqId: number }) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ status: requests.statuses.disputed })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: "Request disputed",
      type: "info",
    },
  });

  return { success: true };
}

async function handle_set_req_done(req: Request, { reqId }: { reqId: number }) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ status: requests.statuses.done })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: "Request marked as done",
      type: "info",
    },
  });

  return { success: true };
}

async function handle_reopen_req(req: Request, { reqId }: { reqId: number }) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ status: requests.statuses.OPEN })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: "Request reopened",
      type: "info",
    },
  });

  return { success: true };
}

async function handle_send_payment_request_to_customer(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select("*, vendor:vendor_id(*), customer:customer_id(*)")
    .eq("id", reqId)
    .single();

  if (!paymentRequest) throw new NotFoundException("Payment request not found");
  await checkRequestBelongsToUser(userId, reqId);

  // Get customer details
  const { data: customer } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentRequest.customer_id)
    .single();

  if (!customer) throw new NotFoundException("Customer not found");

  // Generate verification code
  const code = await create_verification_code_for_payment_request({
    business: customer,
    req: paymentRequest,
  });

  const { data: itemsData } = await supabase
    .from(TABLES.DocumentItems)
    .select("*")
    .eq("document_header_id", reqId);
  paymentRequest.items = itemsData;
  // Send email
  const isDraft = paymentRequest.status === requests.statuses.DRAFT;
  const isNewRequest = paymentRequest.status === requests.statuses.OPEN;
  const userMessage =
    isDraft || isNewRequest
      ? "You have received a new"
      : "There is an update in your";
  const html = await fetchHtmlForRequest(
    paymentRequest,
    userMessage,
    `${APP_DOMAIN}/payments-to/${reqId}`,
    paymentRequest.customer.id,
    paymentRequest.vendor.id,
    {
      requestDate: paymentRequest.request_date,
      supplyDate: paymentRequest.supply_date,
      dueDate: paymentRequest.due_date,
    }
  );

  await send_email({
    to: customer.email,
    subject: `New ${paymentRequest.document_type.toLowerCase()} from ${
      paymentRequest.vendor.business_name
    }`,
    replyTo: paymentRequest.vendor.email,
    html,
    senderBusinessName: paymentRequest.vendor.business_name,
    business_name: customer.business_name,
  });

  // Update payment request status
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ status: requests.statuses.OPEN })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  // // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: "Request sent to customer",
      type: "info",
    },
  });

  return { success: true };
}

async function handle_get_payment_request_link(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Get customer details
  const { data: customer } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentRequest.customer_id)
    .single();

  if (!customer) throw new BadRequestException("Customer not found");

  // Generate verification code
  const code = await create_verification_code_for_payment_request({
    business: customer,
    req: paymentRequest,
  });

  return {
    success: true,
    link: `${APP_DOMAIN}/payments-out/${reqId}`,
  };
}

async function handle_send_payment_request_to_vendor(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Get vendor details
  const { data: vendor } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentRequest.vendor_id)
    .single();

  if (!vendor) throw new BadRequestException("Vendor not found");

  // Send email
  const html = await fetchHTML("payment_request_update_for_vendor", [
    {
      patternToReplace: "%%customer%%",
      replaceWith: paymentRequest.customer_name,
    },
    {
      patternToReplace: "%%request_url%%",
      replaceWith: `${APP_DOMAIN}/payments-in/${reqId}`,
    },
    {
      patternToReplace: "%%document_type%%",
      replaceWith: paymentRequest.document_type.toLowerCase(),
    },
  ]);

  await send_email({
    to: vendor.email,
    subject: `New ${paymentRequest.document_type.toLowerCase()} from ${
      paymentRequest.customer_name
    }`,
    html,
    replyTo: paymentRequest.customer_email,
    senderBusinessName: paymentRequest.customer_name,
    business_name: vendor.business_name,
  });

  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: paymentRequest.id,
      message: "Request sent to vendor",
      type: "info",
    },
  });

  return { success: true };
}

async function handle_get_req_for_unAuthenticated_user(
  req: Request,
  { reqId, emailCode }: { reqId: number; emailCode: string }
) {
  const { supabase } = await requireAuth(req);

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Get customer details
  const { data: customer } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", paymentRequest.customer_id)
    .single();

  if (!customer) throw new BadRequestException("Customer not found");

  // Verify email code
  const code = await create_verification_code_for_payment_request({
    business: customer,
    req: paymentRequest,
  });

  if (code !== emailCode) throw new BadRequestException("Invalid email code");

  return { success: true, paymentRequest };
}

async function handle_get_request(req: Request, { reqId }: { reqId: number }) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  return { success: true, paymentRequest };
}

async function handle_send_sms_from_chat(
  req: Request,
  {
    reqId,
    message,
  }: {
    reqId: number;
    message: {
      content: string;
      type: string;
    };
  }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Get recipient details
  const recipientId =
    paymentRequest.vendor_id === userId
      ? paymentRequest.customer_id
      : paymentRequest.vendor_id;
  const { data: recipient } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", recipientId)
    .single();

  if (!recipient) throw new BadRequestException("Recipient not found");

  // Send SMS
  await send_sms({
    to: recipient.phone,
    body: message.content,
    from: recipient.business_name,
  });

  // Create log
  await createLog({
    change: {
      sender_id: userId,
      request_id: reqId,
      message: message.content,
      type: "sms",
    },
  });

  return { success: true };
}

async function handle_send_email_from_chat(
  req: Request,
  {
    reqId,
    message,
  }: {
    reqId: number;
    message: {
      content: string;
      type: string;
    };
  }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select("*, vendor:vendor_id(*), customer:customer_id(*)")
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  const { error } = await supabase.from(TABLES.Messages).insert({
    message: message.content,
    request_id: reqId,
    sender_id: userId,
    type: message.type,
  });

  if (error) throw new BadRequestException(error.message);

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Get recipient details
  const recipientId =
    paymentRequest.vendor_id === userId
      ? paymentRequest.customer_id
      : paymentRequest.vendor_id;
  const { data: recipient } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", recipientId)
    .single();

  if (!recipient) throw new BadRequestException("Recipient not found");

  // // Send email
  // const html = await fetchHTML(
  //   "email_from_chat",
  //   [
  //     {
  //       patternToReplace: "%%sender%%",
  //       replaceWith: paymentRequest.vendor_id === userId ? paymentRequest.vendor.business_name : paymentRequest.customer.business_name
  //     },
  //     {
  //       patternToReplace: "%%message%%",
  //       replaceWith: message.content
  //     },
  //     {
  //       patternToReplace: "%%request_url%%",
  //       replaceWith: `${APP_DOMAIN}/payments-in/${reqId}`
  //     }
  //   ]
  // );

  // await send_email({
  //   to: recipient.email,
  //   subject: `New message about your ${paymentRequest.document_type.toLowerCase()}`,
  //   html,
  //   replyTo: paymentRequest.vendor_id === userId ? paymentRequest.vendor.email : paymentRequest.customer.email,
  //   senderBusinessName: paymentRequest.vendor_id === userId ? paymentRequest.vendor.business_name : paymentRequest.customer.business_name,
  //   business_name: recipient.business_name
  // });

  return { success: true };
}

async function handle_get_request_payments_status(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Get payments
  const { data: payments } = await supabase
    .from(TABLES.Payments)
    .select()
    .eq("document_id", reqId);

  return {
    success: true,
    payments: payments || [],
  };
}

async function handle_mark_document_as_open(
  req: Request,
  { reqId }: { reqId: number }
) {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;

  // Get payment request
  const { data: paymentRequest } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();

  if (!paymentRequest)
    throw new BadRequestException("Payment request not found");

  // Check if user has access to the request
  const hasAccess = await checkRequestBelongsToUser(userId, paymentRequest.id);
  if (!hasAccess)
    throw new BadRequestException("User does not have access to this request");

  // Update opened_by
  const { error } = await supabase
    .from(TABLES.DocumentHeader)
    .update({ opened_by: userId })
    .eq("id", reqId);

  if (error) throw new Error(error.message);

  return { success: true };
}

export const getPaymentRequests = async (req: Request, res: Response) => {
  const businessId = req.query.businessId as string;
  if (!businessId) {
    return res.status(400).json({ error: "Business ID is required" });
  }

  try {
    const { data: paymentRequests, error } = await supabase
      .from("payment_requests")
      .select("*")
      .or(`vendor_id.eq.${businessId},customer_id.eq.${businessId}`);

    if (error) {
      console.error("Error fetching payment requests:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch payment requests" });
    }

    return res.status(200).json(paymentRequests);
  } catch (error) {
    console.error("Error in getPaymentRequests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
