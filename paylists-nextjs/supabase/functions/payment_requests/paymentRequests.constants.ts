export const INITIAL_NUMBERS = {
  PAYMENT_REQUEST_TYPE: 10000000,
  INVOICE_TYPE: 20000000,
  PLANNING_TYPE: 30000000,
  PURCHASE_INVOICE_TYPE: 40000000,
}

export const PAYMENT_DOCUMENT_TYPES = {
  PAYMENT_REQUEST: "Payment request",
  INVOICE: "Invoice",
  PLANING: "Planning Payment",
  PURCHASE_INVOICE: "Bill",
};

// Document number formatting function
export const formatDocumentNumber = (documentType: string, number: number): string => {
  const paddedNumber = number.toString().padStart(8, '0');
  
  switch (documentType) {
    case PAYMENT_DOCUMENT_TYPES.PAYMENT_REQUEST:
      return `PR${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.INVOICE:
      return `INV${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.PLANING:
      return `PLN${paddedNumber}`;
    case PAYMENT_DOCUMENT_TYPES.PURCHASE_INVOICE:
      return `BIL${paddedNumber}`;
    default:
      return paddedNumber;
  }
};
