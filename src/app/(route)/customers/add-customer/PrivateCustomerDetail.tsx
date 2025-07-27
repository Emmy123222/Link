"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerForm } from "./CustomerFormContext";
import { STEPS } from "./config";
import AutoCompleteAddress from "@/components/autoCompleteAddress";
import { Address } from "@/types/country";
import { useForm } from "react-hook-form";
import CountryList from "@/components/countryList";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Business } from "@/types/business";
import { useCustomersContext } from "../layout";
import { useApp } from "@/providers/AppProvider";
import { useCreateCustomerBusiness } from "@/hooks/use-customers";
import PhoneInput from "@/components/phoneInput";

const accountDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email address"),
  street_1: z.string().min(1, "Address line 1 is required"),
  street_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postcode is required"),
  countryCode: z.number().min(1, "Country is required"),
  mobile_phone_number: z.string().min(1, "Mobile phone number is required"),
  mobile_code_area: z.number().min(1, "Mobile phone code is required"),
});

export type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>

export default function PrivateCustomerDetail() {

  const { formData, setCurrentStep } = useCustomerForm();
  const { customers } = useCustomersContext();
  const { currentBusiness } = useApp();
  const { mutateAsync: createCustomer, isPending: isCreatingCustomer } = useCreateCustomerBusiness();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: { email: formData.email }
  })

  const onSubmit = async (data: AccountDetailsFormValues) => {
    const { name, lastname, ...rest } = { ...data, ...formData } as unknown as Business
    rest.business_name = name + " " + lastname
    rest.trade_name = name + " " + lastname
    rest.business_name_lowercase = name.toLowerCase() + " " + lastname.toLowerCase()
    const res = await createCustomer({ customerData: rest, businessId: currentBusiness!.id, tempBusiness: customers.map(item => item.id) })
    if (res.status === "success") {
      setCurrentStep(STEPS.FINISH)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-[70vh] p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="space-y-4">
          <div className="mb-4">
            <Input
              label="Name*"
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Lastname*"
              id="lastname"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("lastname")}
              error={errors.lastname?.message}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Email*"
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Mobile Phone Number*</p>
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
        </div>


        <AutoCompleteAddress setAddress={(value) => {
          setValue('street_1', value.line_1 || "")
          setValue('city', value.town_or_city || "")
          setValue('postal_code', value.postcode || "")
        }} />

        {/* Address Line 1 */}
        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">Or add address manually</p>
          <div className="mb-4">
            <Input
              label="Address Line 1*"
              id="street_1"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("street_1")}
              error={errors.street_1?.message}
            />
          </div>

          {/* Address Line 2 */}
          <div className="mb-4">
            <Input
              label="Address Line 2"
              id="street_2"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("street_2")}
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
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
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
        <div className="mb-4 mt-4">
          <p className="text-sm text-gray-600 mb-2">Country*</p>
          <CountryList setCountry={(value) => setValue("countryCode", Number(value.ID))} />
          {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => reset({})}
            colorSchema="gray"
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isCreatingCustomer}
            colorSchema="green"
            variant="primary"
            className="flex-1"
          >
            {isCreatingCustomer ? "Saving..." : "Save & continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
