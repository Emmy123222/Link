export enum Plans {
  FREE = "FREE",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  FREE_SMS = "FREE SMS",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
}

export interface UserPackage {
  id: string;
  plan: Plans;
  transactions?: number;
  paid_amount: number;
  created_date: Date;
  active: boolean;
  from_business?: string;
  sms?: number;
}

export const PlansConfig = {
  [Plans.FREE]: {
    transactions: 5,
    paid_amount: 0,
  },
  [Plans.BRONZE]: {
    transactions: 5,
    paid_amount: 3,
  },
  [Plans.SILVER]: {
    transactions: 20,
    paid_amount: 11,
  },
  [Plans.GOLD]: {
    transactions: 50,
    paid_amount: 25,
  },
  [Plans.FREE_SMS]: {
    sms: 25,
    paid_amount: 0,
  },
  [Plans.STANDARD]: {
    sms: 100,
    paid_amount: 5,
  },
  [Plans.PREMIUM]: {
    sms: 200,
    paid_amount: 9,
  },
};
