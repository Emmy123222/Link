import { CountryCode } from "./country-code.ts";
import { PaymentRequestType } from "./payments.ts";
import { PhoneAreaCode } from "./phone-area-code.ts";

export interface User {
  id: string;
  created_at?: Date;
  countryCode: CountryCode;
  email: string;
  name: string;
  lastname: string;
  defaultPaymentDocument: PaymentRequestType;
  phone: string;
  city: string;
  postal_code: string;
  street_1: string;
  street_2: string;
  label: PhoneAreaCode | number;
  firebase_code: string;
  guest_user: boolean;
  xero_userid: string;
}
