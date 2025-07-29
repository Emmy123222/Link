export type CustomerFormData = {
  business_name: string;
  trade_name: string;
  email: string;
  business_name_lowercase: string;
  business_type: 'Public sector organization' | 'Personal customer';
  city: string;
  street_1: string;
  street_2: string;
  postal_code: string;
  countryCode: number;
  mobile_code_area: number;
  mobile_phone_number: string;
  contact_name: string;
  business_category: number;
};

export const STEPS = {
  CONFIRM_NAME: 1,
  CONFIRM_EMAIL: 2,
  BUSINESS_DETAILS: 3,
  FINISH: 4,
} as const;

export const STEP_CONFIG = {
  [STEPS.CONFIRM_NAME]: {
    title: "Customer Name",
    description: "First, let's try to find the customer in Paylists network. If the customer's business exist you will only need to select it.",
    component: "ConfirmCustomerName",
  },
  [STEPS.CONFIRM_EMAIL]: {
    title: "Customer Email",
    description: "Please enter the customer's email address for communication.",
    component: "ConfirmCustomerEmail",
  },
  [STEPS.BUSINESS_DETAILS]: {
    title: "Business Details",
    description: "Please provide the business details.",
    component: "CustomerDetail",
  },
  [STEPS.FINISH]: {
    title: "Finish",
    description: "Review and confirm the customer details.",
    component: "FinishStep",
  },
} as const;

export const PROGRESS_STEPS = [
  { id: 1, label: "Vendor details" },
  { id: 2, label: "Finish" },
]; 