"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"


export default function FinishStep() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-sm border p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-foreground">Vendor added successfully!</h2>
        <p className="text-muted-foreground mb-8">
          You can start sending payment requests to your vendor to receive
          money
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/vendors")}
            className="flex-1"
            colorSchema="green"
            variant="outline"
          >
            Go to vendors
          </Button>
        </div>
      </div>
    </div>
  )
}
