import { supabase } from "../supabaseClient";

const invokeFunction = (functionName: string, action: string) => {
  const res = (data: any) =>
    supabase.functions.invoke(functionName, {
      method: "POST",
      body: {
        action,
        data,
      },
    });
  return res;
};

export const serv_create_doc_after_registration = invokeFunction(
  "user",
  "create_doc_after_registration"
);

export const serv_sign_up = invokeFunction(
  "user",
  "sign_up"
);

export const serv_get_user_by_id = invokeFunction(
  "user",
  "get_user_by_id"
);

export const serv_send_phone_verification_sms = invokeFunction(
  "user",
  "send_phone_verification_sms"
);

export const serv_verify_phone_code = invokeFunction(
  "user",
  "verify_phone_code"
);

export const serv_do_business_creation = invokeFunction(
  "business",
  "create_business"
);

export const serv_send_business_verify_email = invokeFunction(
  "business",
  "send_business_verify_email"
);

export const serv_create_user = invokeFunction(
  "user",
  "create_user"
);

export const serv_send_verify_email = invokeFunction(
  "user",
  "send_verify_email"
);

export const serv_reset_password_email = invokeFunction(
  "user",
  "reset_password_email"
);

export const serv_verify_code_from_email = invokeFunction(
  "business",
  "verify_code_from_email"
);

export const serv_add_customer = invokeFunction(
  "business",
  "add_customer"
);

export const serv_add_vendor = invokeFunction(
  "business",
  "add_vendor"
);

export const serv_update_business = invokeFunction(
  "business",
  "update_business"
);

export const serv_update_business_address = invokeFunction(
  "business",
  "update_business_address"
);

export const serv_get_business_customers = invokeFunction(
  "business",
  "get_business_customers"
);

export const serv_get_business_vendors = invokeFunction(
  "business",
  "get_business_vendors"
);


export const serv_delete_vendor = invokeFunction(
  "business",
  "delete_vendor"
);

export const serv_delete_customer = invokeFunction(
  "business",
  "delete_customer"
);

export const serv_update_business_by_creator = invokeFunction(
  "business",
  "update_business_by_creator"
);

export const serv_list_businesses = invokeFunction(
  "business",
  "list_businesses"
);

export const serv_create_payment_intent = invokeFunction(
  "payment_requests",
  "create_payment_request_to_receive"
);

export const serv_send_payment_request_email = invokeFunction(
  "payment_requests",
  "send_payment_request_to_customer"
);

export const serv_mark_as_paid = invokeFunction(
  "payment_requests",
  "mark_document_as_open"
);

export const serv_delete_payment_request = invokeFunction(
  "payment_requests",
  "delete_payment_req"
)

export const serv_delete_draft_document = invokeFunction(
  "payment_requests",
  "delete_draft_document"
)

export const serv_cancel_open_document = invokeFunction(
  "payment_requests",
  "cancel_open_document"
)

export const serv_update_payment_request = invokeFunction(
  "payment_requests",
  "update_payment_request"
)

export const serv_reopen_req = invokeFunction(
  "payment_requests",
  "reopen_req"
)

export const serv_send_letter = invokeFunction(
  "payment_requests",
  "log_letter"
)

export const serv_send_late_letter = invokeFunction(
  "payment_requests",
  "log_late_payment_letter"
)

export const serv_send_message = invokeFunction(
  "payment_requests",
  "send_email_from_chat"
)

export const serv_send_payment_request_to_vendor = invokeFunction(
  "payment_requests",
  "send_payment_request_to_vendor"
)

export const serv_update_payment_request_for_vendor = invokeFunction(
  "payment_requests",
  "update_payment_request_for_vendor"
)