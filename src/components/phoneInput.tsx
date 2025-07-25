// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Input } from "@/components/ui/input"
// import CountryList from "@/components/countryList"

// const phoneSchema = z.object({
//   phone: z
//     .string()
//     .min(1, "Phone number is required")
//     .regex(/^\d+$/, "Only numbers are allowed"),
//   phoneCode: z.string().min(1, "Country is required"),
//   countryId: z.number().min(1, "Country is required"),
// })

// type PhoneFormValues = z.infer<typeof phoneSchema>

// interface PhoneInputProps {
//   value?: string
//   onChange?: (value: string) => void
//   onCountryChange?: (code: number) => void
//   onPhoneCodeChange?: (code: string) => void
//   defaultPhoneNumber?: string
//   defaultPhoneCode?: string
//   defaultCountryId?: number
//   error?: string
//   className?: string
//   placeholder?: string
//   required?: boolean
//   disabled?: boolean
//   name?: string
// }

// export default function PhoneInput({
//   value,
//   onChange,
//   onCountryChange,
//   onPhoneCodeChange,
//   defaultCountryId,
//   defaultPhoneNumber,
//   defaultPhoneCode,
//   error,
//   className = "",
//   placeholder = "Phone number",
//   required = false,
//   disabled = false,
//   name,
// }: PhoneInputProps) {
//   const {
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<PhoneFormValues>({
//     resolver: zodResolver(phoneSchema),
//     defaultValues: {
//       phone: defaultPhoneNumber || "",
//       phoneCode: defaultPhoneCode,
//       countryId: defaultCountryId,
//     },
//     mode: "onChange",
//   })

//   const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber || "")

//   useEffect(() => {
//     if (value !== undefined) {
//       setPhoneNumber(value)
//       setValue("phone", value)
//     }
//   }, [value, setValue])

//   useEffect(() => {
//     setValue("phone", defaultPhoneNumber || "")
//     setValue("phoneCode", defaultPhoneCode || "")
//     setValue("countryId", defaultCountryId || 0)
//   }, [defaultPhoneNumber, defaultPhoneCode, defaultCountryId, setValue])

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value.replace(/\D/g, "")
//     setPhoneNumber(newValue)
//     setValue("phone", newValue)
//     onChange?.(newValue)
//   }

//   const handleCountrySelect = (country: { phone_code: { id: number, phone_code: string } }) => {
//     setValue("phoneCode", country.phone_code.phone_code)
//     setValue("countryId", country.phone_code.id)
//     onCountryChange?.(country.phone_code.id)
//     onPhoneCodeChange?.(country.phone_code.phone_code)
//   }

//   return (
//     <div className={`flex gap-2 w-full ${className}`}>
//       <div className="w-24">
//         <CountryList
//           setCountry={handleCountrySelect}
//           setPhoneCode={onCountryChange}
//           defaultCountry={watch("countryId")}
//           disabled={disabled}
//         />
//         {errors.phoneCode && (
//           <p className="mt-1 text-sm text-red-600">{errors.phoneCode.message}</p>
//         )}
//       </div>
//       <div className="flex-1">
//         <Input
//           name={name}
//           value={phoneNumber}
//           onChange={handlePhoneChange}
//           className={`w-full px-3 py-2 border ${error || errors.phone ? "border-red-500" : "border-gray-300"
//             } rounded-md`}
//           placeholder={placeholder}
//           error={error || errors.phone?.message}
//           required={required}
//           disabled={disabled}
//         />
//       </div>
//     </div>
//   )
// } 