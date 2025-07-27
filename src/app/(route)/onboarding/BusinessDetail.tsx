"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BusinessDetailsFormValues, businessDetailsSchema } from "@/lib/validations/business"
import BusinessCategory from "@/components/businessCategory"
import CountryList from "@/components/countryList"
import { useApp } from "@/providers/AppProvider"
import { Business } from "@/types/business"
import AutoCompleteAddress from "@/components/autoCompleteAddress"
import PhoneInput from "@/components/phoneInput"
import { useUpdateBusiness } from "@/hooks/use-businesses"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "./layout"

type Props = {
  next: () => void
  onBack: () => void
}

export default function BusinessDetail({ next, onBack }: Props) {
  const { setCurrentBusiness, businesses, setBusinesses, user } = useApp()!;
  const { business, setBusiness } = useOnboarding()
  const { mutateAsync: updateBusiness, isPending: isUpdating } = useUpdateBusiness();

  // Pre-populate contact name with user's name and lastname
  const defaultContactName = user?.name && user?.lastname ? `${user.name} ${user.lastname}` : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      business_name: business?.business_name || "",
      trade_name: business?.business_name || "",
      contact_name: defaultContactName,
      street_1: business?.street_1 || user?.street_1 || "",
      street_2: business?.street_2 || user?.street_2 || "",
      city: business?.city || user?.city || "",
      postal_code: business?.postal_code || user?.postal_code || "",
      countryCode: business?.countryCode || user?.countryCode as unknown as number,
      business_category: Number(business?.business_category) || 0,
      mobile_phone_number: user?.phone || "",
      mobile_code_area: user?.label as unknown as number || user?.countryCode as unknown as number,
    },
  })

  const onSubmit = async (data: BusinessDetailsFormValues) => {
    let { contact_name, ...rest } = data
    const name = contact_name.split(" ")[0]
    const lastname = contact_name.split(" ")[1]
    const businessData = { ...rest, ...business, name, lastname, business_name_lowercase: rest.trade_name?.toLowerCase() } as Partial<Business>;
    const res = await updateBusiness({ businessId: String(business?.id), updates: businessData })
    if (res.status === "success") {
      setCurrentBusiness(businessData as Business)
      setBusinesses([...businesses, businessData as Business])
      setBusiness(null)
      next()
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
              onBlur={() => {
                setValue("trade_name", getValues("business_name"))
              }}
              error={errors.business_name?.message}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Trade name*"
              id="trade_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("trade_name")}
              error={errors.trade_name?.message}
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
            <p className="text-sm text-gray-600 mb-4">Business category*</p>
            <BusinessCategory {...register("business_category")} />
            {errors.business_category && <p className="mt-1 text-sm text-red-600">{errors.business_category.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">Business phone number (pre-filled with your personal number):</p>
          <PhoneInput
            value={getValues('mobile_phone_number')}
            defaultCountryId={user?.label as unknown as number || user?.countryCode as unknown as number}
            defaultPhoneNumber={user?.phone || ""}
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
          setValue('street_2', value.line_2 || "")
          setValue('city', value.town_or_city || "")
          setValue('postal_code', value.postcode || "")
        }} />

        {/* Address Line 1 */}
        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">Business address (pre-filled with your personal address):</p>
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

          {/* Address Line 2 */}
          <div className="mb-4">
            <Input
              label="Address Line 2"
              id="address_line_2"
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

          {/* Country */}
          <div className="mb-6">
            <CountryList 
              setCountry={(value) => {
                setValue('countryCode', Number(value.ID))
              }}
              defaultCountry={user?.countryCode as unknown as number}
            />
            {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onBack}
              colorSchema="gray"
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              colorSchema="green"
              variant="primary"
              className="flex-1"
            >
              {isUpdating ? "Saving..." : "Save & continue"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
