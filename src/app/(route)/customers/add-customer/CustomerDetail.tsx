"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useCustomerForm } from "./CustomerFormContext";
import { STEPS } from "./config";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BusinessCategory from "@/components/businessCategory";
import PhoneInput from "@/components/phoneInput";
import AutoCompleteAddress from "@/components/autoCompleteAddress";
import CountryList from "@/components/countryList";
import { Business } from "@/types/business";
import { useCreateCustomerBusiness } from "@/hooks/use-customers";
import { useApp } from "@/providers/AppProvider";
import { useCustomersContext } from "../layout";

const businessDetailsSchema = z.object({
  business_name: z.string().min(1, { message: "Business name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  contact_name: z.string().min(1, { message: "Contact name is required" }),
  street_1: z.string().min(1, { message: "Address line 1 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postcode is required" }),
  business_category: z.coerce.number().min(1, { message: "Business category is required" }),
  mobile_phone_number: z.string().min(1, { message: "Mobile phone number is required" }),
  mobile_code_area: z.coerce.number().min(1, { message: "Mobile phone code is required" }),
  countryCode: z.coerce.number().min(1, { message: "Country is required" }),
});

export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>

export default function CustomerDetail() {

  const { formData, setCurrentStep } = useCustomerForm();
  const { mutateAsync: createCustomer, isPending: isCreatingCustomer } = useCreateCustomerBusiness();
  const { customers, setCustomers } = useCustomersContext();
  const { currentBusiness } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: formData as unknown as BusinessDetailsFormValues,
  })

  const onSubmit = async (data: BusinessDetailsFormValues) => {
    let { contact_name, ...rest } = data
    const name = contact_name.split(" ")[0]
    const lastname = contact_name.split(" ")[1]
    const businessData = { ...rest, ...formData, name, lastname, business_name_lowercase: rest.business_name?.toLowerCase(), trade_name: rest.business_name } as Partial<Business>;
    const res = await createCustomer({ customerData: businessData, businessId: currentBusiness!.id, tempBusiness: customers.map(item => item.id) })
    if (res.status === "success") {
      setCurrentStep(STEPS.FINISH)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 overflow-auto max-h-[70vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="pt-4">

          <div className="mb-4">
            <Input
              label="Legal name*"
              id="legal_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("business_name")}
              error={errors.business_name?.message}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Contact name*"
              id="contact_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("contact_name")}
              error={errors.contact_name?.message}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Email*"
              id="email"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">Business category*</p>
            <BusinessCategory {...register("business_category")} />
            {errors.business_category && <p className="mt-1 text-sm text-red-600">{errors.business_category.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">Add your business phone number:</p>
          <PhoneInput
            value={getValues('mobile_phone_number')}
            onCountryChange={(value) => {
              setValue('mobile_code_area', Number(value))
            }}
            onChange={(value) => {
              setValue('mobile_phone_number', value)
            }}
          />
          {errors.mobile_phone_number && <p className="mt-1 text-sm text-red-600">{errors.mobile_phone_number.message}</p>}
        </div>

        <AutoCompleteAddress setAddress={(value) => {
          setValue('street_1', value.line_1 || "")
          setValue('city', value.town_or_city || "")
          setValue('postal_code', value.postcode || "")
        }} />

        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">Or add address manually</p>
          {/* Address Line 1 */}
          <div className="mb-4">
            <Input
              label="Address Line 1*"
              id="address_line_1"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("street_1")}
              error={errors.street_1?.message}
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <Input
              label="City*"
              id="city"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("city")}
              error={errors.city?.message}
            />
          </div>

          {/* Postcode */}
          <div className="mb-4">
            <Input
              label="Postcode*"
              id="postal_code"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("postal_code")}
              error={errors.postal_code?.message}
            />
          </div>
        </div>

        {/* Country */}
        <div className="mb-6">
          <CountryList setCountry={(value) => {
            setValue('countryCode', Number(value.ID))
          }} />
          {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setCurrentStep(STEPS.CONFIRM_TYPE)}
            colorSchema="gray"
            variant="outline"
            className="flex-1"
            disabled={isCreatingCustomer}
          >
            Back
          </Button>
          <Button
            type="submit"
            colorSchema="green"
            variant="primary"
            className="flex-1"
            disabled={isCreatingCustomer}
          >
            {isCreatingCustomer ? "Saving..." : "Save & continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}