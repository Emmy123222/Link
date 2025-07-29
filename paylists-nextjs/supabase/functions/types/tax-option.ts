export enum Tax {
  VAT_20 = 20,
  VAT_5 = 5,
  NO_VAT = 0,
}

export enum TaxOption {
  TAX_INCLUSIVE = "TAX_INCLUSIVE",
  TAX_EXCLUSIVE = "TAX_EXCLUSIVE",
  NO_TAX = "NO_TAX",
}

export const TaxText: {
  [key: string]: string;
} = {
  [Tax.VAT_20]: "20% (VAT on Income)",
  [Tax.VAT_5]: "5% (VAT on Income)",
  [Tax.NO_VAT]: "No VAT",
};

export const TaxOptionText = {
  [TaxOption.TAX_INCLUSIVE]: "Tax inclusive",
  [TaxOption.TAX_EXCLUSIVE]: "Tax exclusive",
  [TaxOption.NO_TAX]: "No tax",
};
