"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IoMdArrowDropdown } from "react-icons/io"
import * as z from "zod"
import { useUpdateBusiness } from "@/hooks/use-businesses"
import { Business, GuestCustomersPaymentForm } from "@/types/business"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BusinessConfig } from "@/constants/businessConfig"
import { useApp } from "@/providers/AppProvider"

// Form validation schema
const legalSchema = z.object({
  vat_number: z.coerce.number().optional(),
  registration_number: z.coerce.number().optional(),
  currency: z.string().min(1, { message: BusinessConfig.validation.legal.currency.required }),
  payment_terms: z.string().min(1, { message: BusinessConfig.validation.legal.paymentTerms.required }),
  partial_payments: z.boolean().optional(),
  guest_customers_payment_form: z.string().optional(),
  id: z.string().optional(),
})

type LegalFormValues = z.infer<typeof legalSchema>

export default function LegalInput({ editable }: { editable: boolean }) {
  const { currentBusiness, setCurrentBusiness } = useApp()!
  const { mutateAsync: updateBusiness } = useUpdateBusiness()
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues = useMemo(() => ({
    defaultValues: {
      registration_number: Number(currentBusiness?.registration_number),
      currency: currentBusiness?.currency || "",
      payment_terms: currentBusiness?.payment_terms?.toString() || "",
      partial_payments: currentBusiness?.partial_payments || false,
      guest_customers_payment_form: currentBusiness?.guest_customers_payment_form || "",
    },
    disabled: !editable,
  }), [currentBusiness, editable])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<LegalFormValues>({
    resolver: zodResolver(legalSchema),
    ...defaultValues,
  })

  const onSubmit = async (data: LegalFormValues) => {
    setIsLoading(true)
    const dataToUpdate = {
      vat_number: data.vat_number,
      registration_number: data.registration_number,
      currency: data.currency,
      payment_terms: Number(data.payment_terms) || 7,
      partial_payments: data.partial_payments,
      guest_customers_payment_form: data.guest_customers_payment_form as GuestCustomersPaymentForm,
    }
    const res = await updateBusiness({ businessId: currentBusiness!.id, updates: dataToUpdate as Partial<Business> })
    if (res.status === "success") {
      setCurrentBusiness({
        ...currentBusiness,
        ...data,
        payment_terms: Number(data.payment_terms) || 7,
      } as Business)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* VAT Number */}
      <div>
        <Input
          id="vat_number"
          label={BusinessConfig.formLabels.vatNumber}
          error={errors.vat_number?.message || ""}
          {...register("vat_number")}
        />
      </div>

      {/* Registration Number */}
      <div>
        <Input
          id="registration_number"
          label={BusinessConfig.formLabels.registrationNumber}
          error={errors.registration_number?.message || ""}
          {...register("registration_number")}
        />
      </div>

      {/* Main Currency */}
      <div>
        <label htmlFor="currency" className="block text-sm text-gray-600 mb-1">
          {BusinessConfig.formLabels.mainCurrency}
        </label>
        <div className="relative">
          <select
            id="currency"
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("currency")}
          >
            {BusinessConfig.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
      </div>

      {/* Payment Terms */}
      <div>
        <label htmlFor="payment_terms" className="block text-sm text-gray-600 mb-1">
          {BusinessConfig.formLabels.paymentTerms}
        </label>
        <div className="relative">
          <select
            id="payment_terms"
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("payment_terms")}
            defaultValue={watch("payment_terms") || BusinessConfig.paymentTerms[0]}
          >
            {BusinessConfig.paymentTerms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        {errors.payment_terms && <p className="mt-1 text-sm text-red-600">{errors.payment_terms.message}</p>}
      </div>

      {/* Allow Partial Payments */}
      <div>
        <label htmlFor="partial_payments" className="block text-sm text-gray-600 mb-1">
          {BusinessConfig.formLabels.partialPayments}
        </label>
        <div className="relative">
          <select
            id="partial_payments"
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue={watch("partial_payments") ? "Yes" : "No"}
            onChange={(e) => setValue("partial_payments", e.target.value === "Yes")}
          >
            {BusinessConfig.yesNoOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        {errors.partial_payments && <p className="mt-1 text-sm text-red-600">{errors.partial_payments.message}</p>}
      </div>

      {/* Guest Payment Form */}
      <div>
        <label htmlFor="guestPaymentForm" className="block text-sm text-gray-600 mb-1">
          {BusinessConfig.formLabels.guestPaymentForm}
        </label>
        <div className="relative">
          <select
            id="guest_customers_payment_form"
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("guest_customers_payment_form")}
          >
            {BusinessConfig.formOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        {errors.guest_customers_payment_form && <p className="mt-1 text-sm text-red-600">{errors.guest_customers_payment_form.message}</p>}
      </div>

      {/* Business ID */}
      <div>
        <label htmlFor="businessId" className="block text-sm text-gray-600 mb-1">
          {BusinessConfig.formLabels.businessId}
        </label>
        <input
          id="business_id"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          readOnly
          disabled={true}
          value={currentBusiness?.id}
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-4 mt-4 gap-4">
        <Button type="button" variant="outline" colorSchema="black" onClick={() => reset()}>
          {BusinessConfig.buttonLabels.discard}
        </Button>
        <Button type="submit" colorSchema="green" variant="outline" disabled={isLoading || !editable}>
          {BusinessConfig.buttonLabels.save}
        </Button>
      </div>
    </form>
  )
}