export const general = {
  our_domain: Deno.env.get("APP_DOMAIN"),
};

export const requests = {
  statuses: {
    CLOSED: "Paid",
    DISPUTED: "Disputed",
    OPEN: "Open",
    DONE: "Done",
    LATE_PAYMENT: "Late payment",
    DRAFT: "Draft",
  },
  vendorOwnerId: "vendorOwnerId",
  customerOwnerId: "customerOwnerId",
  changesLog: "changesLog",
  notifications: "notifications",
  messages: "messages",
  general: {
    closedToLongTime: 1000 * 60 * 60 * 24 * 30,
  },
};

export const ui_paths = {
  payments_to_pay: "payments-to-pay",
  payments_to_receive: "payments-to-receive",
};

export const user_agreement = {
  version: 1,
  agreement: "user_agreement",
  revision_date: "June 21, 2024 at 00:00:00 AM",
};

export const privacy_agreement = {
  version: 1,
  agreement: "privacy_agreement",
  revision_date: "June 21, 2024 at 00:00:00 AM",
};
