"use client"

import { useState } from "react"
import { Radio } from "@/components/radioButton"
import AutoCompleteCompany from "@/components/autoCompleteCompany"
import { Business, BusinessType } from "@/types/business"
import { BUSINESS_TYPES, BUSINESS_TYPES_KEYS } from "@/utils/functions"
import { useApp } from "@/providers/AppProvider"
import { Company } from "@/types/country"
import { Select } from "@/components/ui/select"
import { useOnboarding } from "./layout"

const DEFAULT_CURRENCY = "GBP";
const DEFAULT_BUSINESS_TYPE = BUSINESS_TYPES_KEYS.LIMITED_COMPANY as BusinessType;

const BUSINESS_TYPE_OPTIONS = [
  { label: "Sole Trader", value: BUSINESS_TYPES_KEYS.SOLE_TRADER_PRIVATE_INDIVIDUAL },
  { label: "Limited Company", value: BUSINESS_TYPES_KEYS.LIMITED_COMPANY },
  { label: "Public sector organization", value: BUSINESS_TYPES_KEYS.PUBLIC_SECTOR_ORGANIZATION }
];

type Props = {
  next?: () => void;
};

export default function ConfirmLLP({ next }: Props) {
  const [isResidential, setIsResidential] = useState("true");
  const [value, setValue] = useState<string>("yes")
  const [company, setCompany] = useState<Company | null>(null)
  const { user } = useApp()
  const [currentBusinessType, setCurrentBusinessType] = useState<BusinessType | null>(DEFAULT_BUSINESS_TYPE)
  const { business, setBusiness } = useOnboarding()

  const handelSend = async () => {
    const businessData: Partial<Business> = {
      business_type: BUSINESS_TYPES[DEFAULT_BUSINESS_TYPE] as BusinessType,
      payment_integration: false,
      accounting_integration: false,
      currency: DEFAULT_CURRENCY,
    };

    if (value === "yes" && company) {
      businessData.business_name = company.title;
      businessData.trade_name = company.title;
      businessData.business_type = BUSINESS_TYPES[BUSINESS_TYPES_KEYS.LIMITED_LIABILITY_PARTNERSHIP] as BusinessType
      businessData.business_name_lowercase = company.title.toLowerCase();
      businessData.registration_number = company.company_number;
      businessData.city = company.address.locality;
      businessData.street_1 = company.address.address_line_1;
      businessData.street_2 = company.address.address_line_2;
      businessData.postal_code = company.address.postal_code;
    } else {
      businessData.business_type = BUSINESS_TYPES[currentBusinessType as BusinessType] as BusinessType
      if (isResidential === "true") {
        businessData.countryCode = user?.countryCode as number;
        businessData.city = user?.city;
        businessData.postal_code = user?.postal_code;
        businessData.street_1 = user?.street_1;
      }
    }

    setBusiness({ ...business, ...businessData } as Business)
    next?.()
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <h2 className="text-md font-medium mb-6">Is your business a limited company or a limited liability partnership (LLP)?</h2>

        <div>
          <Radio
            name="radio"
            options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
            selectedValue={value}
            onChange={(value) => {
              setValue(value)
              setCompany(null)
            }}
          />
        </div>

        {value === "yes" && (
          <AutoCompleteCompany setCompany={setCompany} />
        )}
        {value === "no" && (
          <>
            <div className="space-y-6">
              <Select
                label="Please select your business type*"
                id="businessType"
                options={BUSINESS_TYPE_OPTIONS}
                defaultValue={currentBusinessType as string}
                onChange={(e) => {
                  setCurrentBusinessType(e.target.value as BusinessType)
                }}
              />
            </div>
            <div className="space-y-6">
              <label htmlFor="businessName" className="block text-sm font-medium mb-1">
                Is your business address the same as your residential address?
              </label>
            </div>
            <div>
              <Radio
                name="radio"
                options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
                selectedValue={isResidential}
                onChange={setIsResidential}
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={handelSend}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Send & Continue
          </button>
        </div>
      </div>
    </div >
  )
}
