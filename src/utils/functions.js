import { ROLES_KEYS } from "@supabase/functions/types/payments";
import { CountriesWithEmoji } from "@/constants/countries";

//user
export const profileImageStoragePath = (profileId) => `profile_img`;

// businesses
export const businessOwnerField = "ownerId";
export const businessImageStoragePath = (businessId) => `${businessId}/img_url`;

//functions
export const functions = {
  add_new_user_to_db:
    "https://us-central1-muly-2a091.cloudfunctions.net/create_doc_after_registration",
};

//vendors
export const addVendorRout = "/add-vendor";

//customer
export const addCustomerRout = "/add-customer";

// requests
export const requestsPath = "paymentsRequests";

export const firestorePaths = {
  collections: {
    paymentRequests: {
      fields: {
        wasDeleted: "wasDeleted",
        customerOwnerId: "customerOwnerId",
        customerId: "customerId",
        vendorOwnerId: "vendorOwnerId",
        vendorId: "vendorId",
      },
    },
  },
};

export const PUBLIC_SECTOR_ORGANIZATION = "PUBLIC_SECTOR_ORGANIZATION";
export const BUSINESS_TYPES_KEYS = {
  SOLE_TRADER_PRIVATE_INDIVIDUAL: "SOLE_TRADER_PRIVATE_INDIVIDUAL",
  // PARTNERSHIP: "PARTNERSHIP",
  LIMITED_COMPANY: "LIMITED_COMPANY",
  LIMITED_LIABILITY_PARTNERSHIP: "LIMITED_LIABILITY_PARTNERSHIP",
  [PUBLIC_SECTOR_ORGANIZATION]: PUBLIC_SECTOR_ORGANIZATION,
};
export const BUSINESS_TYPES = {
  [BUSINESS_TYPES_KEYS.SOLE_TRADER_PRIVATE_INDIVIDUAL]: "Sole Trader",
  // [BUSINESS_TYPES_KEYS.PARTNERSHIP]: "Partnership",
  [BUSINESS_TYPES_KEYS.LIMITED_COMPANY]: "Limited Company",
  [BUSINESS_TYPES_KEYS.LIMITED_LIABILITY_PARTNERSHIP]:
    "Limited Liability Partnership (LLP)",
  [BUSINESS_TYPES_KEYS.PUBLIC_SECTOR_ORGANIZATION]:
    "Public sector organization",
};

export const ROLES = {
  [ROLES_KEYS.SOLE_TRADER]: "Sole Trader",
  [ROLES_KEYS.DIRECTOR]: "Director",
  [ROLES_KEYS.APPROVED_PERSON]: "Approved Person",
  [ROLES_KEYS.BENEFICIAL_OWNER]: "Beneficial Owner",
  [ROLES_KEYS.PSC]: "Person of Significant Control",
  [ROLES_KEYS.PARTNER]: "Partner",
  [ROLES_KEYS.BILLING]: "Billing Contact",
  [ROLES_KEYS.SUPPORT]: "Support Contact",
};

//routes
export const paths = {
  addBusinessRout: "add-business",
  addCustomerRout: "add-customer",
  myBusinessesRout: "my-businesses",
  businessDetailsRout: "business-details",
  paymentsToPayRout: "payments-to-pay",
  singlePaymentToPayRout: "payments-to-pay/:id",
  paymentsToReceiveRout: "payments-to-receive",
  singlePaymentReceiveRout: "payments-to-receive/:id",
  addPaymentRequestToPayRout: "add-payment-request-to-pay",
  addPaymentRequestToReceiveRout: "add-payment-request-to-receive",
  editPaymentRequestRout: "edit-payment-request/:id",
  customersRout: "customers",
  singleCustomerRout: "customers/:id",
  vendorsRout: "vendors",
  singleVendorRout: "vendors/:id",
  addVendorRout: "add-vendor",
  loginRout: "login",
  forgotPassWordRout: "forgot-password",
  registerRout: "register",
  myAccountRout: "my-account",
  states: "states",
  currencyRatios: "currency-ratios",
  latePayments: "late-payments",
  xeroAuth: "xero-auth",
  stripeOnboarding: "stripe-onboarding",
  stripeReturn: "stripe-return",
  businessCreated: "business-created",
  checkout: "checkout",
  onboarding: "onboarding",
  auth: "auth",
  paymentIntegration: "payment-integration",
  openBanking: "open-banking",
  accountingIntegration: "accounting-integration",
  pricing: "pricing",
  summary: "summary",
  xeroSignIn: "xero-signin",
  dashboard: "dashboard",
};

export const PATH_NAMES = {
  SINGLE_PAYMENT_TO_RECEIVE: "singlePaymentReceiveRout",
  SINGLE_PAYMENT_TO_PAY: "singlePaymentToPayRout",
  CHECKOUT_ROUTE: "checkoutRoute",
};

export const DEFAULT_PAYMENT_TERMS = 30;
export const DATE_FORMAT = "DD/MM/YYYY";

export const PAYMENT_DOCUMENT_TYPES = {
  PAYMENT_REQUEST: "Payment request",
  INVOICE: "Invoice",
  PLANING: "Planning Payment",
  PURCHASE_INVOICE: "Bill",
};

export const PAYMENT_DOCUMENT_TYPE_CODES = {
  [PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST]: "PR",
  [PAYMENT_DOCUMENT_TYPES.INVOICE]: "INV",
  [PAYMENT_DOCUMENT_TYPES.PLANING]: "PLN",
  [PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE]: "BIL",
};

export const PAYMENT_DOCUMENT_TYPES_SHORT = {
  [PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST]: "Request",
  [PAYMENT_DOCUMENT_TYPES.INVOICE]: "Invoice",
  [PAYMENT_DOCUMENT_TYPES.PLANING]: "Planning",
  [PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE]: "Bill",
};

export const REQUEST_PAYMENT_DOCUMENT_TYPES = {
  PAYMENT_REQUEST: PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST,
  INVOICE: PAYMENT_DOCUMENT_TYPES.INVOICE,
};

export const PLAN_PAYMENT_DOCUMENT_TYPES = {
  PLANING: PAYMENT_DOCUMENT_TYPES.PLANING,
  PURCHASE_INVOICE: PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE,
};

export const PAYMENT_REQUEST_STATUS = {
  OPEN: "Open",
  DELAY: "Delayed",
  LATE_PAYMENT: "Late payment",
  CLOSE: "Paid",
  REOPEN: "Reopen",
  DRAFT: "Draft",
};

export const PAYMENT_REQUEST_OPEN_STATUSES = [
  PAYMENT_REQUEST_STATUS.OPEN,
  PAYMENT_REQUEST_STATUS.DELAY,
  PAYMENT_REQUEST_STATUS.LATE_PAYMENT,
];

export const CURRENCIES = [/*"USD", "EUR", */ "GBP"];
export const CURRENCIES_SYMBOLS = {
  GBP: "£",
  EUR: "€",
  USD: "$",
};

export const COLLECTIN_TYPE = {
  PAID: "Paid",
  UNPAID: "Unpaid",
  TO_BE_PAID: "To be paid",
  ALL: "All",
  ALL_PAID: "All paid",
  ALL_UNPAID: "All unpaid",
  ALL_TO_BE_PAID: "All to be paid",
  DRAFT: "Draft",
};

export const COLLECTIN_TYPE_FILTER = {
  [COLLECTIN_TYPE.PAID]: "paid",
  [COLLECTIN_TYPE.UNPAID]: "unpaid",
  [COLLECTIN_TYPE.TO_BE_PAID]: "ToBePaid",
  [COLLECTIN_TYPE.ALL]: "All",
};

export const ERROR_MESSAGE = {
  "auth/email-already-in-use": "Email already in use.",
};

export const COLLECTIN_TYPE_TEXTS = {
  UNPAID: "The payment due date has passed",
  PAID: "Payment completed",
  TO_BE_PAID: "The payment due date has not passed",
};
