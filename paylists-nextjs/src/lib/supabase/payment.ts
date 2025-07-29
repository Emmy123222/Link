import {
  serv_create_payment_intent,
  serv_mark_as_paid,
  serv_send_payment_request_email,
  serv_delete_payment_request,
  serv_update_payment_request,
  serv_reopen_req,
  serv_send_letter,
  serv_send_message,
  serv_send_payment_request_to_vendor,
  serv_delete_draft_document,
  serv_cancel_open_document,
  serv_send_late_letter,
} from "./functions";
import { TABLES } from "@/constants/tables";
import { supabase } from "@/lib/supabaseClient";

export const createPaymentIntent = async (data: any) => {
  const { data: response, error } = await serv_create_payment_intent(data);
  if (error) {
    throw error;
  }
  return response;
};

export const sendPaymentRequestEmail = async (data: any) => {
  const { data: response, error } = await serv_send_payment_request_email(data);
  if (error) {
    throw error;
  }
  return response;
};

export const markAsPaid = async (data: any) => {
  const { data: response, error } = await serv_mark_as_paid(data);
  if (error) {
    throw error;
  }
  return response;
};

export const deletePaymentRequest = async (id: number) => {
  const { data, error } = await serv_delete_payment_request({ reqId: id });
};

export const getPaymentsIn = async (vendorId: string) => {
  const { data, error } = await supabase
    .from(TABLES.DocumentHeader)
    .select("*, vendor:vendor_id(*), customer:customer_id(*)")
    .eq("vendor_id", vendorId)
    .not("status", "eq", "Deleted"); // Filter out deleted documents
  if (error) {
    throw error;
  }
  return data;
};

export const updatePaymentRequest = async (data: any) => {
  const { paymentRequestId, updates } = data;
  const { data: response, error } = await serv_update_payment_request({
    updates,
    paymentRequestId,
    doNotNotify: false,
  });
  const { data: response2, error: error2 } =
    await serv_send_payment_request_to_vendor({ reqId: paymentRequestId });
  if (error || error2) {
    throw error || error2;
  }
  return response || response2;
};

export const F = async (customerId: string) => {
  const { data, error } = await supabase
    .from(TABLES.DocumentHeader)
    .select("*, customer:customer_id(*), vendor:vendor_id(*)")
    .eq("customer_id", customerId)
    .not("status", "eq", "Deleted")
    .neq("status", "Draft"); // Filter out deleted documents
  if (error) {
    throw error;
  }
  return data;
};

export const reopenRequest = async (id: number) => {
  const { data, error } = await serv_reopen_req({ reqId: id });
  if (error) {
    throw error;
  }
  return data;
};

export const sendLetter = async (data: any) => {
  const { data: response, error } = await serv_send_letter(data);
  if (error) {
    throw error;
  }
  return response;
};

export const sendLateLetter = async (data: any) => {
  const { data: response, error } = await serv_send_late_letter(data);
  if (error) {
    throw error;
  }
  return response;
};

export const sendMessage = async (data: any) => {
  const { data: response, error } = await serv_send_message(data);
  if (error) {
    throw error;
  }
  return response;
};

// Phase 2: Delete Draft Document
export const deleteDraftDocument = async (reqId: number) => {
  const { data, error } = await serv_delete_draft_document({ reqId });
  if (error) {
    throw error;
  }
  return data;
};

// Phase 2: Cancel Open Document
export const cancelOpenDocument = async (reqId: number) => {
  const { data, error } = await serv_cancel_open_document({ reqId });
  if (error) {
    throw error;
  }
  return data;
};
