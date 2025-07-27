"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { useCustomerForm } from "./CustomerFormContext";
import { STEPS } from "./config";
import { BusinessType } from "@/types/business";
import { Radio } from "@/components/radioButton";

export default function ConfirmCustomerType() {
  const { nextStep, updateFormData, setCurrentStep } = useCustomerForm();
  const [selectedType, setSelectedType] = useState<BusinessType | "">("");

  const handleContinue = () => {
    if (selectedType === BusinessType.PUBLIC_SECTOR_ORGANIZATION) {
      updateFormData({ business_type: BusinessType.PUBLIC_SECTOR_ORGANIZATION });
      setCurrentStep(STEPS.BUSINESS_DETAILS);
    } else if (selectedType === BusinessType.SOLE_TRADER_PRIVATE_INDIVIDUAL) {
      updateFormData({ business_type: BusinessType.SOLE_TRADER_PRIVATE_INDIVIDUAL });
      setCurrentStep(STEPS.PRIVATE_DETAILS);
    }
  };

  const options = [
    {
      label: "Business Customer",
      value: BusinessType.PUBLIC_SECTOR_ORGANIZATION
    },
    {
              label: "Personal Customer",
      value: BusinessType.SOLE_TRADER_PRIVATE_INDIVIDUAL
    }
  ]

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <h2 className="text-lg font-medium mb-6">Select customer type</h2>
        <p className="text-sm text-gray-500 mb-6">Please select whether this is a business or personal customer.</p>
        <div className="space-y-4">
          <Radio
            name="customerType"
            options={options}
            selectedValue={selectedType}
            onChange={(value) => setSelectedType(value as BusinessType)}
          />
        </div>

        <Button
          onClick={handleContinue}
          colorSchema="green"
          variant="primary"
          className="w-full mt-6"
          disabled={!selectedType}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
