import * as z from "zod";

export const phoneSchema =
  z.object({
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Only numbers are allowed"),
    phoneCode: z.number().min(1, "Country is required"),
  });
