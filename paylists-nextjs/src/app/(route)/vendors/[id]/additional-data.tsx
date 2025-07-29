import { useEffect, useMemo } from "react"
import { useUpdateBusinessByCreator } from "@/hooks/use-businesses"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Business } from "@/types/business"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApp } from "@/providers/AppProvider"

const businessSchema = z.object({
  contact_name: z.string().min(1, { message: "Contact name is required" }).includes(" ", { message: "Contact name must contain a space" }),
  email: z.string().email({ message: "Invalid email address" }),
})

type BusinessFormValues = z.infer<typeof businessSchema>

export default function AdditionalData({ business, setBusiness, editable }: { business: Business, setBusiness: (business: Business) => void, editable: boolean }) {

  const { mutateAsync: updateBusinessByCreator, isPending } = useUpdateBusinessByCreator()
  const { user } = useApp()!
  const defaultValues = useMemo(() => ({
    defautlValues: {
      email: business?.email || "",
      contact_name: business?.name + " " + business?.lastname || "",
    },
    disabled: !editable
  }
  ), [business, editable])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    ...defaultValues,
  })

  useEffect(() => {
    setValue("email", business?.email || "")
    setValue("contact_name", business?.name + " " + business?.lastname || "")
  }, [business])

  const onSubmit = async (data: any) => {
    const { contact_name, email } = data
    const name = contact_name.split(" ")[0]
    const lastname = contact_name.split(" ")[1]
    const updated = await updateBusinessByCreator({ businessId: business?.id, updates: { email, name, lastname, updated_by: user?.id } })
    if (updated) {
      setBusiness({ ...business, name, lastname, email } as Business)
      toast.success("Business updated successfully")
    } else {
      toast.error("Failed to update business")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            id="contact_name"
            label="Contact Name*"
            error={errors.contact_name?.message || ""}
            {...register("contact_name")}
          />
        </div>

        {/* Business Type */}
        <div>
          <Input
            id="email"
            label="Email*"
            error={errors.email?.message || ""}
            {...register("email")}
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" colorSchema="black" onClick={() => reset()}>
            Cancel
          </Button>
          <Button type="submit" colorSchema="green" isLoading={isPending} variant="outline" disabled={!editable}>
            Save
          </Button>
        </div>
      </form>
    </>
  )
}