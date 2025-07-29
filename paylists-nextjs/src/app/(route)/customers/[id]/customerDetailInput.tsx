import CountryList from "@/components/countryList"
import { useUpdateBusinessByCreator } from '@/hooks/use-businesses'
import AutoCompleteAddress from "@/components/autoCompleteAddress"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMemo } from "react"
import { z } from 'zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApp } from "@/providers/AppProvider"
import PhoneInput from "@/components/phoneInput"
import { Business } from "@/types/business"

const businessDetailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  mobile_code_area: z.number().optional(),
  mobile_phone_number: z.coerce.number().optional(),
  telephone_code_area: z.number().optional(),
  telephone_number: z.coerce.number().optional(),
  fax_code_area: z.number().optional(),
  fax: z.coerce.number().optional(),
  countryCode: z.number().optional(),
  city: z.string().optional(),
  street_1: z.string().optional(),
  street_2: z.string().optional(),
  postal_code: z.string().optional(),
})

type BusinessDetailFormValues = z.infer<typeof businessDetailSchema>

export default function CustomerDetailInput({ editable, business, setBusiness }: { editable: boolean, business: Business, setBusiness: (data: any) => void }) {

  const { mutateAsync: updateBusinessByCreator, isPending: isPendingByCreator } = useUpdateBusinessByCreator()
  const { user } = useApp()!
  const defaultValues = useMemo(() => ({
    defaultValues: {
      email: business?.email || "",
      mobile_phone_number: business?.mobile_phone_number || "",
      telephone_number: business?.telephone_number || "",
      fax: business?.fax || "",
      countryCode: business?.countryCode || 0,
      city: business?.city || "",
      street_1: business?.street_1 || "",
      street_2: business?.street_2 || "",
      postal_code: business?.postal_code || "",
    },
    disabled: !editable
  }), [business, editable])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BusinessDetailFormValues>({
    resolver: zodResolver(businessDetailSchema),
    ...defaultValues,
  })

  const onSubmit = async (data: any) => {
    let businessData = {
      ...data,
      mobile_code_area: data.mobile_code_area,
      telephone_code_area: data.telephone_code_area,
      fax_code_area: data.fax_code_area,
      updated_by: user?.id,
    }
    businessData = Object.fromEntries(
      Object.entries(businessData).filter(([_, v]) => v !== undefined)
    );

    console.log(businessData)

    const res = await updateBusinessByCreator({ businessId: business!.id, updates: businessData })
    if (res.status === "success") {
      setBusiness({
        ...business,
        ...data,
        mobile_code_area: Number(data.mobile_code_area),
        telephone_code_area: Number(data.telephone_code_area),
        fax_code_area: Number(data.fax_code_area),
      } as Business)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Business Name */}
      <div>
        <Input
          id="email"
          label="Email*"
          error={errors.email?.message || ""}
          {...register("email")}
        />
      </div>

      {/* Business Trade Name */}
      <div>
        <label htmlFor="mobile_code_area" className="block text-sm text-gray-600 mb-1">
          Mobile code area*
        </label>
        <PhoneInput
          defaultPhoneNumber={watch("mobile_phone_number")?.toString()}
          defaultCountryId={business?.mobile_code_area}
          onChange={(value: string) => setValue("mobile_phone_number", Number(value))}
          onCountryChange={(value: number) => setValue("mobile_code_area", value)}
          disabled={!editable}
        />
      </div>
      <div>
        <label htmlFor="telephone_code_area" className="block text-sm text-gray-600 mb-1">
          Telephone number*
        </label>
        <PhoneInput
          defaultPhoneNumber={watch("telephone_number")?.toString()}
          defaultCountryId={business?.telephone_code_area}
          onChange={(value: string) => setValue("telephone_number", Number(value))}
          onCountryChange={(value: number) => setValue("telephone_code_area", value)}
          disabled={!editable}
        />
      </div>
      <div>
        <label htmlFor="fax_code_area" className="block text-sm text-gray-600 mb-1">
          Fax number*
        </label>
        <PhoneInput
          defaultPhoneNumber={watch("fax")?.toString()}
          defaultCountryId={business?.fax_code_area}
          onChange={(value: string) => setValue("fax", Number(value))}
          onCountryChange={(value: number) => setValue("fax_code_area", value)}
          disabled={!editable}
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="countryCode" className="block text-sm text-gray-600 mb-1">
          Country
        </label>
        <CountryList setCountry={(value) => setValue("countryCode", value.ID)} defaultCountry={Number(watch("countryCode")) || 0} disabled={!editable} />
        {errors.countryCode && (
          <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>
        )}
      </div>

      {/* City */}

      <AutoCompleteAddress setAddress={(value) => { setValue("city", value.town_or_city); setValue("postal_code", value.postcode); setValue("street_1", value.line_1); setValue("street_2", value.line_2); }} disabled={!editable} />
      <div className="pt-4">
        <p className="text-sm text-gray-600 mb-4">Or add address manually</p>
        <div>
          <Input
            id="street_1"
            label="Street 1*"
            error={errors.street_1?.message || ""}
            {...register("street_1")}
          />
        </div>

        {/* Street 2 */}
        <div>
          <Input
            id="street_2"
            label="Street 2"
            error={errors.street_2?.message || ""}
            {...register("street_2")}
          />
        </div>
        <div>
          <Input
            id="city"
            label="City*"
            error={errors.city?.message || ""}
            {...register("city")}
          />
        </div>
        {/* Postal Code */}
        <div>
          <Input
            id="postal_code"
            label="Postal code*"
            error={errors.postal_code?.message || ""}
            {...register("postal_code")}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button type="button" variant="outline" colorSchema="black" onClick={() => reset()}>
          Discard changes
        </Button>
        <Button type="submit" colorSchema="green" isLoading={isPendingByCreator} variant="outline" disabled={!editable}>
          Update
        </Button>
      </div>
    </form>
  )
}