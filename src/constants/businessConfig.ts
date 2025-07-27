export const BusinessConfig = {
  tabs: {
    owner: [
      "General",
      "Business details",
      "Bank details",
      "Legal & commercial",
    ],
    guest: [
      "General",
      "Additional data",
    ],
  },
  currencies: ["GBP"],
  paymentTerms: ["7", "14", "30", "45", "60", "90"],
  yesNoOptions: ["Yes", "No"],
  formOptions: ["Default", "Extended"],
  validation: {
    businessName: {
      required: "Business name is required",
    },
    tradeName: {
      required: "Business trade name is required",
    },
    businessType: {
      required: "Business type is required",
    },
    businessCategory: {
      required: "Business category is required",
    },
    contactName: {
      required: "Contact name is required",
      space: "Contact name must contain a space",
    },
    email: {
      required: "Email is required",
      invalid: "Invalid email address",
    },
    bankAccount: {
      name: {
        required: "Bank account name is required",
      },
      number: {
        required: "Bank account number is required",
        numeric: "Bank account number must be a number",
      },
      sortCode: {
        required: "Sort code is required",
        numeric: "Sort code must be a number",
      },
    },
    legal: {
      currency: {
        required: "Main currency is required",
      },
      paymentTerms: {
        required: "Payment terms are required",
      },
    },
  },
  messages: {
    success: {
      update: "Business updated successfully",
    },
    error: {
      update: "Failed to update business",
      save: "Error saving details",
    },
  },
  buttonLabels: {
    cancel: "Cancel",
    save: "Save",
    update: "Update",
    discard: "Discard changes",
  },
  formLabels: {
    businessName: "Business Name*",
    tradeName: "Business trade name*",
    businessType: "Business type*",
    businessCategory: "Business category*",
    website: "Business website",
    contactName: "Contact Name*",
    email: "Email*",
    bankAccountName: "Bank account name",
    bankAccountNumber: "Bank account number",
    sortCode: "Sort code",
    vatNumber: "Vat number",
    registrationNumber: "Registration number",
    mainCurrency: "Main currency*",
    paymentTerms: "Payment terms (Days)",
    partialPayments: "Allow partial payments?",
    guestPaymentForm: "Guest customers payment form",
    businessId: "Business Paylists ID",
  },
}; 