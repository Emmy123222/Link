"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useApp } from "@/providers/AppProvider"
import { User } from "@/types/user"
import CountryList from "@/components/countryList"
import AutoCompleteAddress from "@/components/autoCompleteAddress"
import { Address } from "@/types/country"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUpdateProfile } from "@/hooks/use-user"
import PhoneInput from "@/components/phoneInput"
import { accountDetailsSchema, AccountDetailsFormValues } from "@/lib/validations/business"

type Props = {
  next: () => void
}

export default function PersonalDetailsPage({ next }: Props) {
  const { user, setUser } = useApp()
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()
  const [label, setLabel] = useState<number>(user?.label as unknown as number)
  const [phone, setPhone] = useState<string>(user?.phone || "")

  const defaultValues = useMemo(() => ({
    name: user?.name || "",
    lastname: user?.lastname || "",
    street_1: user?.street_1 || "",
    street_2: user?.street_2 || "",
    city: user?.city || "",
    postal_code: user?.postal_code || "",
    countryCode: user?.countryCode as unknown as number,
  }), [user])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues
  })

  const onSubmit = async (data: AccountDetailsFormValues) => {
    const detailedProfile = {
      ...data,
      id: user?.id,
      guest_user: false,
      label,
      phone,
    } as Partial<User>

    const res = await updateProfile(detailedProfile)
    if (res.status === "success") {
      setUser({ ...user, ...detailedProfile, label, phone } as User);
      next()
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
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <PhoneInput
              onChange={(value) => {
                setPhone(value)
              }}
              onCountryChange={(value) => {
                setLabel(Number(value))
              }}
              defaultCountryId={user?.countryCode as unknown as number}
              defaultPhoneNumber={user?.phone || ""}
            />
          </div>
        </div>

        {/* Manual Address Section */}
        <div className="pt-4 mb-4">

          <AutoCompleteAddress setAddress={(value: Partial<Address>) => {
            setValue("street_1", value.line_1 || "")
            setValue("street_2", value.line_2 || "")
            setValue("city", value.town_or_city || "London")
            setValue("postal_code", value.postcode || "")
          }} />
        </div>
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
            onClick={() => reset(defaultValues)}
            colorSchema="gray"
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            colorSchema="green"
            variant="primary"
            className="flex-1"
          >
            {isPending ? "Saving..." : "Save & continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
