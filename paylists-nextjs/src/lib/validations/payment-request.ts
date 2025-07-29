import { z } from "zod";

export const paymentRequestSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  requestDate: z.string().min(1, "Request date is required"),
  supplyDate: z.string().min(1, "Supply date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  allowPartialPayments: z
    .string()
    .min(1, "Please select partial payment option"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const numVal = parseFloat(val.replace(/,/g, ""));
      return !isNaN(numVal) && numVal > 0;
    }, "Amount must be a valid positive number"),
  currency: z.string().min(1, "Currency is required"),
  referenceNumber: z
    .string()
    .min(1, "Reference number is required")
    .max(50, "Reference number must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});

export type PaymentRequestFormData = z.infer<typeof paymentRequestSchema>;

export const addPaymentSchema = z.object({
  paymentType: z.string().min(1, "Payment type is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  amount: z.coerce
    .number()
    .min(1, "Amount is required")
    .refine((val) => val > 0, "Amount must be a valid positive number"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

export type AddPaymentFormData = z.infer<typeof addPaymentSchema>;
