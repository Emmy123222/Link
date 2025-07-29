import { z } from "zod";

export const customerUpdatesSchema = z.object({
  plan_due_date: z.string().optional().nullable(),
  payment_method: z.string().optional().nullable(),
});

export type CustomerUpdatesFormValues = z.infer<typeof customerUpdatesSchema>;
