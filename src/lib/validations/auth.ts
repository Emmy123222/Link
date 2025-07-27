import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    verifyPassword: z.string().min(1, { message: "Please confirm your password" }),
    agreeToTerms: z.boolean().refine((val) => val === true, { message: "You must agree to the terms to continue" }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords do not match",
    path: ["verifyPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const accountSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  label: z.number().min(1, { message: "Label is required" }),
  street_1: z.string().min(1, { message: "Address line 1 is required" }),
  street_2: z.string().optional(),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }),
});

export const phoneSchema = z.object({
  phone: z.string().min(1, { message: "Phone number is required" }),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export type PhoneFormValues = z.infer<typeof phoneSchema>

export type AccountFormValues = z.infer<typeof accountSchema>

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>