import * as z from "zod";

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
})

export type Email = z.infer<typeof emailSchema>