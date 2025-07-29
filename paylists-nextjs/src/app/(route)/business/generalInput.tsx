"use client"

import { useMemo } from "react"
import BusinessCategory from "@/components/businessCategory"
import { useUpdateBusiness } from "@/hooks/use-businesses"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import BusinessType from "@/components/businessType"
import { Business } from "@/types/business"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApp } from "@/providers/AppProvider"
import { BusinessConfig } from "@/constants/businessConfig"

const businessSchema = z.object({
  business_name: z.string().min(1, { message: BusinessConfig.validation.businessName.required }),
  trade_name: z.string().min(1, { message: BusinessConfig.validation.tradeName.required }),
  business_type: z.string().min(1, { message: BusinessConfig.validation.businessType.required }),
  business_category: z.union([z.number().min(1, { message: BusinessConfig.validation.businessCategory.required }), z.string().optional()]),
  website: z.string().optional(),
})

type BusinessFormValues = z.infer<typeof businessSchema>

export default function GeneralInput({ editable }: { editable: boolean }) {

  const { mutateAsync: updateBusiness, isPending } = useUpdateBusiness()
  const { setCurrentBusiness, currentBusiness } = useApp()!

  const defaultValues = useMemo(() => ({
    defaultValues: {
      business_name: currentBusiness?.business_name || "",
      trade_name: currentBusiness?.trade_name || "",
      business_type: currentBusiness?.business_type || "",
      business_category: Number(currentBusiness?.business_category),
      website: currentBusiness?.website || "",
    },
    disabled: !editable
  }), [currentBusiness, editable])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    ...defaultValues,
  })

  const onSubmit = async (data: BusinessFormValues) => {
    const res = await updateBusiness({ businessId: currentBusiness!.id, updates: data as unknown as Partial<Business> })
    if (res.status === "success") setCurrentBusiness({ ...currentBusiness, ...data } as unknown as Business)
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            id="business_name"
            label={BusinessConfig.formLabels.businessName}
            error={errors.business_name?.message || ""}
            {...register("business_name")}
          />
        </div>

        {/* Business Trade Name */}
        <div>
          <Input
            id="trade_name"
            label={BusinessConfig.formLabels.tradeName}
            error={errors.trade_name?.message || ""}
            {...register("trade_name")}
          />
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="business_type" className="block text-sm text-gray-600 mb-1">
            {BusinessConfig.formLabels.businessType}
          </label>
          <BusinessType {...register("business_type")} />
          {errors.business_type && (
            <p className="mt-1 text-sm text-red-600">{errors.business_type.message}</p>
          )}
        </div>

        {/* Business Category */}
        <div>
          <label htmlFor="business_category" className="block text-sm text-gray-600 mb-1">
            {BusinessConfig.formLabels.businessCategory}
          </label>
          <BusinessCategory {...register("business_category")} />
          {errors.business_category && (
            <p className="mt-1 text-sm text-red-600">{errors.business_category.message}</p>
          )}
        </div>

        {/* Business Website */}
        <div>
          <Input
            id="website"
            label={BusinessConfig.formLabels.website}
            error={errors.website?.message || ""}
            {...register("website")}
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" colorSchema="black" onClick={() => reset()}>
            {BusinessConfig.buttonLabels.cancel}
          </Button>
          <Button type="submit" colorSchema="green" isLoading={isPending} variant="primary" disabled={!editable}>
            {BusinessConfig.buttonLabels.save}
          </Button>
        </div>
      </form>
    </>
  )
}