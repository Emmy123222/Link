import { PhoneAreaCode } from "./phone-area-code.ts";

export interface CountryCode {
  ID?: string | null;
  created_at?: Date;
  countryName: string;
  countryCode: string;
  icon: string;
  phone_code: PhoneAreaCode;
}
