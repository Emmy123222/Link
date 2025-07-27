import * as z from "zod"

export const accountDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  addressSearch: z.string().optional(),
  street_1: z.string().min(1, { message: "Address Line 1 is required" }),
  street_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }).refine((val) => !isNaN(val), { message: "Country is required" }),
})

export const businessDetailsSchema = z.object({
  business_name: z.string().min(1, { message: "Legal name is required" }),
  trade_name: z.string().min(1, { message: "Trade name is required" }),
  business_category: z.union([z.string().min(1, { message: "Category is required" }), z.number().min(1, { message: "Category is required" })]),
  contact_name: z.string().includes(" ", { message: "Contact name must contain full name." }).min(1, { message: "Contact name is required" }),
  street_1: z.string().min(1, { message: "Address line 1 is required" }),
  street_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }).refine((val) => !isNaN(val), { message: "Country is required" }),
  mobile_phone_number: z.string().min(1, { message: "Mobile phone number is required" }),
  mobile_code_area: z.number().min(1, { message: "Mobile phone code is required" }),
})

export const businessSchema = z.object({
  businessEmail: z.string().email({ message: "Invalid email address" }).min(1, { message: "Business email is required" }),
})

export const searchSchema = z.object({
  keyword: z.string().min(1, { message: "Keyword is required" }),
})


export type SearchFormValues = z.infer<typeof searchSchema>
export type BusinessFormValues = z.infer<typeof businessSchema>
export type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>
export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>