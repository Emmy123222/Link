export interface DocumentHeader {
  id: number;
  created_at: Date;
  created_by: string;
  updated_by: string;
  createdByBusiness: number;
  document_type: number;
  vendorId: number;
  customerId: number;
  vendorOwnerId: string;
  customerOwnerId: string;
  currency: number;
  initial_amount: number;
  amount: number;
  paid_amount: number;
  request_date: Date;
  initial_supply_date: Date;
  supply_date: Date;
  initial_due_date: Date;
  due_date: Date;
  plan_due_date: Date;
  receiving_date: Date;
  closeAt: Date;
  description: string;
  email_code: string;
  email_to_verify: string;
  partial_payments: string;
  payment_done: boolean;
  payment_method: number;
  payment_request_tax: number;
  payment_service_provider: number;
  reference_number: string;
  remainder: number;
  req_number: number;
  sent_to_client: boolean;
  status: DocumentStatus;
  terms: string;
  wasDeleted: boolean;
  xeroContactId: string;
  xeroInvoiceId: string;
  xeroInvoiceNumber: string;
  note: string;
  OLD_DOCUMENT_ID: string;
}

export interface PaymentItem {
  id: number;
  header_id: number;
  created_at: Date;
  created_by: string;
  updated_by: string;
  name: string;
  price: number;
  currency: number;
  quantity: number;
  tax: number;
  note: string;
}

export interface PaymentTransaction {
  id: number;
  header_id: number;
  created_at: Date;
  created_by: string;
  updated_by: string;
  paymentDate: Date;
  amount: number;
  currency: number;
  type: number;
  method: number;
  card_type: number;
  description: string;
  status: string;
}

export enum PaymentRequestType {
  PAYMENT_REQUEST = "Payment request",
  INVOICE = "Invoice",
  PLANING = "Planning Payment",
  PURCHASE_INVOICE = "Bill",
}

export enum DocumentStatus {
  DRAFT = "Draft",
  OPEN = "Open",
  PAID = "Paid",
  DELAYED = "Delayed",
  LATE_PAYMENT = "Late payment",
}

export enum PaymentMethod {
  OPEN_BANKING = "Open banking",
  DEBIG_CREDIT_CARD = "Debit / Credit Card",
  BANK_TRANSFER = "Bank transfer",
  CASH = "Cash",
  CHEQUE = "Cheque",
}

export enum TransactionMethodUsed {
  CARD = "CARD",
  PAYPAL_DIRECT = "PAYPAL_DIRECT",
  PAY_BY_BANK_ACCOUNT = "PAY_BY_BANK_ACCOUNT",
  VISA_CHECKOUT = "VISA_CHECKOUT",
  APPLE_PAY = "APPLE_PAY",
  GOOGLE_PAY = "GOOGLE_PAY",
  REPORTED_VIA_XERO = "REPORTED_VIA_XERO",
}

export enum PaymentServiceType {
  GlobalPay = "GlobalPay",
  Crezco = "Crezco"
}

export enum BusinessProgress {
  BusinessDetails = 1,
  Payments,
  Accounting,
}

export enum PaymentOnboardingStage {
  BusinessOwnership = 1.1,
  Contact = 2.1,
  ProductsAndServices = 3.1,
  ProductsAndServicesPhysical = 3.2,
  ProductsAndServicesServices = 3.3,
  ProductsAndServicesDigital = 3.4,
  BankAccount = 4.1,
  SubmitApplication = 5.1,
  Done = 6,
}

export enum PaymentDocRequestStatus {
  CANCELLED = "CANCELLED",
  FULFILLED = "FULFILLED",
  PENDING = "PENDING",
}

export enum ApplicationStatus {
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  NEW = "NEW",
  PENDING = "PENDING",
  PREAPPROVED = "PREAPPROVED",
  REFERRED = "REFERRED",
  REJECTED = "REJECTED",
  SUBMITTED = "SUBMITTED",
}

export const ROLES_KEYS = {
  SOLE_TRADER: "SOLE_TRADER",
  DIRECTOR: "DIRECTOR",
  APPROVED_PERSON: "APPROVED_PERSON",
  BENEFICIAL_OWNER: "BENEFICIAL_OWNER",
  PSC: "PSC",
  PARTNER: "PARTNER",
  BILLING: "BILLING",
  SUPPORT: "SUPPORT",
  APPLICATION: "APPLICATION",
};

export enum AccessPayoutStatus {
  ON_HOLD = "ON_HOLD",
  PENDING = "PENDING",
  INSUFFICIENT_CREDIT = "INSUFFICIENT_CREDIT",
  GENERATED = "GENERATED",
  TRANSFERRED = "TRANSFERRED",
  COMPLETED = "COMPLETED",
  ALLOCATED = "ALLOCATED",
}

export enum RemittanceMethod {
  BACs = "BACs",
  FAST_PAYMENT = "Fast payment",
}


export enum TransactionSummaryType {
  PAYMENT = "PAYMENT",
  AUTHORISATION = "AUTHORISATION",
  CAPTURE = "CAPTURE",
  REFUND = "REFUND",
  VERIFY = "VERIFY",
  CREDIT_NOTE = "CREDIT NOTE",
  MANUAL_PAYMENT = "MANUAL PAYMENT",
}

export enum TransactionSummaryStatus {
  //access paySuite
  DECLINED = "DECLINED",
  SUCCESSFUL = "SUCCESSFUL",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  SUBMITTED = "SUBMITTED",
  PENDING = "PENDING",
  REFERRED = "REFERRED",

  // crezco
  NEW = "NEW",
  AUTHORISED = "AUTHORISED",
  ERROR = "ERROR",
  DENIED = "DENIED",
  ACCEPTED = "ACCEPTED",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",

  // XERO
  INACTIVE = "INACTIVE",

  //Global Payments
  CAPTURED = "CAPTURED",
  REVERSED = "REVERSED",
  // DECLINED="",
  FUNDED = "FUNDED",
  // REJECTED="",
  FOR_REVIEW = "FOR_REVIEW",
  INITIATED = "INITIATED",
  PREAUTHORIZED = "PREAUTHORIZED",
}
export interface CrezcoService {
  user_id: string;
}

export interface GlobalPayService {
  merchant_id: string;
  app_id: string;
  app_key: string;
}
