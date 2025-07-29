"use client"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useUpdateBusiness } from "@/hooks/use-businesses"
import { Business } from "@/types/business"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BusinessConfig } from "@/constants/businessConfig"
import { useApp } from "@/providers/AppProvider"

const bankDetailSchema = z.object({
  bank_account_name: z.string().min(1, { message: BusinessConfig.validation.bankAccount.name.required }),
  bank_account_number: z.string().min(1, { message: BusinessConfig.validation.bankAccount.number.required }),
  sort_code: z.string().min(1, { message: BusinessConfig.validation.bankAccount.sortCode.required }),
})

type BankDetailFormValues = z.infer<typeof bankDetailSchema>

export default function BankDetailInput({ editable }: { editable: boolean }) {
  const { mutateAsync: updateBusiness } = useUpdateBusiness()
  const { setCurrentBusiness, currentBusiness } = useApp()!

  const defaultValues: BankDetailFormValues = useMemo(() => ({
    bank_account_name: currentBusiness?.bank_account_name || "",
    bank_account_number: currentBusiness?.bank_account_number || "",
    sort_code: currentBusiness?.sort_code || "",
  }), [currentBusiness, editable])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BankDetailFormValues>({
    resolver: zodResolver(bankDetailSchema),
    defaultValues,
    disabled: !editable
  })


  const onSubmit = async (data: BankDetailFormValues) => {
    const businessData = {
      bank_account_name: data.bank_account_name,
      bank_account_number: data.bank_account_number,
      sort_code: data.sort_code,
    }
    const updated = await updateBusiness({ businessId: currentBusiness!.id, updates: businessData })
    if (updated) {
      setCurrentBusiness({ ...currentBusiness, ...businessData } as Business)
      toast.success(BusinessConfig.messages.success.update)
    } else {
      toast.error(BusinessConfig.messages.error.update)
    }
  }

  return (
    <div className="bg-card rounded-lg border p-6 max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Bank Account Name */}
        <div>
          <Input
            id="bank_account_name"
            label={BusinessConfig.formLabels.bankAccountName}
            error={errors.bank_account_name?.message || ""}
            {...register("bank_account_name")}
          />
        </div>

        {/* Bank Account Number */}
        <div>
          <Input
            id="bank_account_number"
            label={BusinessConfig.formLabels.bankAccountNumber}
            error={errors.bank_account_number?.message || ""}
            {...register("bank_account_number")}
          />
        </div>

        {/* Sort Code */}
        <div>
          <Input
            id="sort_code"
            label={BusinessConfig.formLabels.sortCode}
            error={errors.sort_code?.message || ""}
            {...register("sort_code")}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <Button type="button" variant="outline" colorSchema="black" onClick={() => reset()}>
            {BusinessConfig.buttonLabels.discard}
          </Button>
          <Button type="submit" colorSchema="green" variant="outline" disabled={!editable}>
            {BusinessConfig.buttonLabels.save}
          </Button>
        </div>
      </form>
    </div>
  )
}
