import { CreationType } from "./creation-type.ts";

export interface Business {
  id: string;
  created_date: Date;
  business_name: string;
  business_type: BusinessType;
  vendorId: number;
  customerId: number;
  business_category: BusinessCategory;
  business_name_lowercase: string;
  name: string;
  lastname: string;
  registration_number: string;
  vat_number: string;
  email: string;
  business_payment_responsible_email: string;
  mobile_code_area: number;
  mobile_phone_number: string;
  telephone_code_area: number;
  telephone_number: string;
  fax_code_area: number;
  fax: string;
  countryCode: number;
  city: string;
  postal_code: string;
  street_1: string;
  street_2: string;
  website?: string;
  currency: string;
  bank_account_name: string;
  bank_account_number: string;
  sort_code: string;
  active: boolean;
  is_deleted: boolean;
  isPrimaryBusiness: null | boolean;
  ownerId: string | null;
  createdBy: string;
  OLD_DOCUMENT_ID: string;
  OLD_ownerId: number;
  OLD_createdBy: Date;
  creation_type: CreationType;
  business_step_completion: string;
  guest_customers_payment_form: GuestCustomersPaymentForm;
  payment_integration: boolean;
  accounting_integration: boolean;
  xeroContactId: string;
  xero_integration_consent: boolean;
  isNotSelect: boolean;
  last_sync: Date;
  partial_payments: boolean;
  payment_request_tax: number;
  payment_terms: number;
  request_number: number;
  invoice_number: number;
  planning_number: number;
  bill_number: number;
  created_by: string;
  updated_by: string;
}

export interface BusinessCategory {
  created_at: Date;
  business_category: string;
}

export enum BusinessType {
  SOLE_TRADER_PRIVATE_INDIVIDUAL = "Sole Trader",
  PARTNERSHIP = "Partnership",
  LIMITED_COMPANY = "Limited Company",
  LIMITED_LIABILITY_PARTNERSHIP = "Limited Liability Partnership (LLP)",
  PUBLIC_SECTOR_ORGANIZATION = "Public sector organization",
  PERSONAL_CUSTOMER = "Personal Customer",
  PERSONAL = "Personal", // New type for personal accounts
}

export enum GuestCustomersPaymentForm {
  DEFAULT = "DEFAULT",
  EXTENDED = "EXTENDED",
}
