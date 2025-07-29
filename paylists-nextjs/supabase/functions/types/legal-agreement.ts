export interface LegalAgreement {
  created_at: Date;
  user_id: string;
  agreed_on: Date;
  agreement: Agreement;
  revision_date: Date;
  version: number;
}

export enum Agreement {
  USER_AGREEMENT = "user_agreement",
  PRIVACY_AGREEMENT = "privacy_agreement",
}
