"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Image } from "@/components/ui/image"

type AccountType = "business" | "personal"

interface AccountTypeSelectionProps {
  onNext: (accountType: AccountType) => void
}

export default function AccountTypeSelection({ onNext }: AccountTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null)

  const handleContinue = () => {
    if (selectedType) {
      onNext(selectedType)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto">
      <div className="hidden md:w-1/2 md:flex justify-center items-center">
        <Image src="/images/business.svg" alt="Account type illustration" width={500} height={500} priority />
      </div>
      <div className="w-full md:w-1/2">
        <div className="bg-card rounded-lg shadow-sm py-8 px-4 sm:px-8 max-w-md mx-auto border">
          <h2 className="text-lg font-medium mb-6">Do you want to create a business account or personal account?</h2>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="accountType"
                value="business"
                checked={selectedType === "business"}
                onChange={(e) => setSelectedType(e.target.value as AccountType)}
                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Business customer</div>
                <div className="text-xs text-gray-500">Create a business account with full business features</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="accountType"
                value="personal"
                checked={selectedType === "personal"}
                onChange={(e) => setSelectedType(e.target.value as AccountType)}
                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Personal customer</div>
                <div className="text-xs text-gray-500">Create a personal account for individual use</div>
              </div>
            </label>
          </div>

          <Button
            onClick={handleContinue}
            colorSchema="green"
            variant="primary"
            className="w-full"
            disabled={!selectedType}
          >
            Send & Continue
          </Button>
        </div>
      </div>
    </div>
  )
} 