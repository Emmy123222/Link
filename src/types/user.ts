import { CountryCode } from "./country-code";
import { PaymentRequestType } from "./payments";
import { PhoneAreaCode } from "./phone-area-code";

export interface User {
  id: string;
  created_at?: Date;
  countryCode: number | CountryCode;
  email: string;
  name: string;
  lastname: string;
  defaultPaymentDocument: PaymentRequestType;
  phone: string;
  city: string;
  postal_code: string;
  street_1: string;
  street_2: string;
  label: PhoneAreaCode;
  firebase_code: string;
  guest_user: boolean;
  xero_userid: string;
  avatar_url?: string; // User profile image URL
}
