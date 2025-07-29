export enum SingleBusinessViews {
  Business = "business",
  Payments = "payments",
  Accounting = "accounting",
  Payouts = "payouts",
}

export const BusinessSections = {
  GENERAL: "General",
  CONTACT_DETAILS: "Contact details",
  BANK_DETAILS: "Bank details",
  LEGAL_COMMERCIAL: "Legal & commercial",
};

export const Sections = {
  GENERAL: "General",
  ADDITIONAL_DATA: "Additional data",
};

export const BusinessTypes = [
  { id: "Sole Trader", name: "Sole trader" },
  { id: "Limited Company", name: "Limited company" },
  { id: "Limited Liability Partnership (LLP)", name: "Limited liability partnership" },
  { id: "Public sector organization", name: "Public sector organization" },
  { id: "Personal", name: "Personal" }, // Add the new Personal type
]