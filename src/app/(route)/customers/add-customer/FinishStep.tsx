"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IoCheckmarkCircle } from "react-icons/io5"


export default function FinishStep() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <IoCheckmarkCircle size={64} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Customer added successfully!</h2>
        <p className="text-gray-600 mb-8">
          You can start sending payment requests to your customer to receive
          money
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/customers")}
            className="flex-1"
            colorSchema="green"
            variant="outline"
          >
            Go to customers
          </Button>
        </div>
      </div>
    </div>
  )
}
