export enum Tax {
  VAT_20 = 20,
  VAT_5 = 5,
  NO_VAT = 0,
}
export const TaxText = {
  [Tax.VAT_20]: "20% (VAT on Income)",
  [Tax.VAT_5]: "5% (VAT on Income)",
  [Tax.NO_VAT]: "No VAT",
};
export enum TaxAmounts {
  TAX_INCLUSIVE = "TAX_INCLUSIVE",
  TAX_EXCLUSIVE = "TAX_EXCLUSIVE",
  NO_TAX = "NO_TAX",
}
export const TaxAmountsText = {
  [TaxAmounts.TAX_INCLUSIVE]: "Tax inclusive",
  [TaxAmounts.TAX_EXCLUSIVE]: "Tax exclusive",
  [TaxAmounts.NO_TAX]: "No tax",
};
