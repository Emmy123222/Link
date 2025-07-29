"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useApp } from "@/providers/AppProvider"
import { useCreateBusiness } from "@/hooks/use-businesses"
import { BusinessType } from "@/types/business"

type AccountType = "business" | "personal"

interface FinishProps {
  onBack: () => void;
  accountType: AccountType | null;
}

export default function Finish({ onBack, accountType }: FinishProps) {
  const router = useRouter()
  const { user } = useApp()!
  const { mutateAsync: createBusiness } = useCreateBusiness()

  useEffect(() => {
    const createPersonalBusiness = async () => {
      if (accountType === "personal" && user) {
        try {
          // Create a personal business automatically
          const personalBusinessData = {
            business_name: `${user.name} ${user.lastname}`,
            trade_name: `${user.name} ${user.lastname}`,
            business_type: BusinessType.PERSONAL, // Use the new Personal type
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            label: user.label,
            isPrimaryBusiness: true,
          }

          await createBusiness({ business: personalBusinessData, userId: user.id })
        } catch (error) {
          console.error("Failed to create personal business:", error)
        }
      }
    }

    createPersonalBusiness()
  }, [accountType, user, createBusiness])

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-sm p-8 text-center border">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-foreground">All set!</h2>
        <p className="text-muted-foreground mb-8">
          You can start sending payment requests to your customers to receive
          money
        </p>

        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full"
          colorSchema="green"
          variant="outline"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
