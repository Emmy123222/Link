import * as z from "zod"

export const accountDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  addressSearch: z.string().optional(),
  street_1: z.string().min(1, { message: "Address Line 1 is required" }),
  street_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }),
})

export const customerDetailsSchema = z.object({
  business_name: z.string().min(1, { message: "Business name is required" }),
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Business email is required" }),
  contact_name: z.string().includes(" ", { message: "Contact name must contain full name." }).min(1, { message: "Contact name is required" }),
  street_1: z.string().min(1, { message: "Address line 1 is required" }),
  street_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }),
  mobile_phone_number: z.string().min(1, { message: "Mobile phone number is required" }),
  mobile_code_area: z.number().min(1, { message: "Mobile phone code is required" }),
})

export const privateCustomerDetailsSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  street_1: z.string().min(1, { message: "Address line 1 is required" }),
  street_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  countryCode: z.number().min(1, { message: "Country is required" }),
  mobile_phone_number: z.string().min(1, { message: "Mobile phone number is required" }),
  mobile_code_area: z.number().min(1, { message: "Mobile phone code is required" }),
})

export type CustomerDetailsFormValues = z.infer<typeof customerDetailsSchema>
export type PrivateCustomerDetailsFormValues = z.infer<typeof privateCustomerDetailsSchema>