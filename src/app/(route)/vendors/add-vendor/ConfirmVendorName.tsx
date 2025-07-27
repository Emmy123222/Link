"use client"

import { useEffect, useState } from "react"
import { BusinessItem } from "@/components/businessItem";
import { Card } from "@/components/card";
import { CheckCircle } from "lucide-react";
import { Business } from "@/types/business";
import { useApp } from "@/providers/AppProvider";
import { useCreateVendor } from "@/hooks/use-vendors";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Country } from "@/types/country";
import { useVendorByName } from "@/hooks/use-vendors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVendorForm } from "./VendorFormContext";
import { useVendorsContext } from "../layout";

type ExtendedBusiness = Business & {
  countryCode: Country
}

export default function ConfirmVendorName() {
  const [name, setName] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<ExtendedBusiness | null>(null)
  const [businesses, setBusinesses] = useState<ExtendedBusiness[]>([])
  const { vendors } = useVendorsContext()
  const { currentBusiness } = useApp()!
  const { mutateAsync: searchBusiness, isPending: isSearchBusinessPending } = useVendorByName()
  const { mutateAsync: createVendor, isPending: isCreateVendorPending } = useCreateVendor()
  const { nextStep, updateFormData, formData } = useVendorForm();

  const router = useRouter()
  const handelSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setSelectedBusiness(null)
  }
  useEffect(() => {
    const fetchData = async () => {
      if (name) {
        const bannedIds = vendors.concat(currentBusiness!).map(item => item.id).join(",")
        const res = await searchBusiness({ name, bannedIds: `(${bannedIds})` })
        if (res && res.length > 0) {
          setBusinesses(res)
        }
      }
    }
    fetchData()
  }, [name, searchBusiness])

  const handleSendCustomer = async () => {
    if (selectedBusiness) {
      const res = await createVendor({
        businessId: currentBusiness?.id || "",
        vendorId: selectedBusiness.id || "",
      })
      if (res.status === "success") {
        router.push("/vendors")
      }
    }
  }

  const handleNext = () => {
    updateFormData({ name });
    nextStep();
  };

  return (
    <div className="max-w-md mx-auto ">
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 transition-all duration-300 ease-out">
        <h2 className="text-lg font-medium mb-6">Enter customer name</h2>
        <p className="text-sm text-gray-500 mb-6">First, let's try to find the customer in Paylists network. If the customer's business exist you will only need to select it.</p>
        <div>
          <Input
            label="Customer Name*"
            value={name}
            onChange={handelSearch}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100`}
          />
        </div>
        {selectedBusiness === null ? (businesses.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto">
            <h3 className="text-sm text-center sticky top-0 bg-white font-medium mb-2">Search Results</h3>
            <ul>
              {businesses.map((item: ExtendedBusiness) => (
                <BusinessItem
                  key={item.id}
                  name={item.business_name}
                  address={`${item.street_1}, ${item.city}, ${item.countryCode?.countryName}`}
                  email={item.email}
                  onClick={() => {
                    setSelectedBusiness(item)
                  }}
                />
              ))}
            </ul>
          </div>
        )) : (
          <div>
            <h3>Selected Vendor</h3>
            <Card
              title={selectedBusiness?.business_name || ""}
              badge="Validated"
              badgeIcon={<CheckCircle className="w-4 h-4 text-gray-400" />}
            >
              <BusinessItem
                name={selectedBusiness?.business_name || ""}
                address={`${selectedBusiness?.street_1}, ${selectedBusiness?.city}, ${selectedBusiness?.countryCode?.countryName}`}
                email={selectedBusiness?.email || ""}
              />
              <Button
                colorSchema="green"
                variant="outline"
                className={`w-full ${isCreateVendorPending ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSendCustomer}
                disabled={isCreateVendorPending}
              >
                Add Vendor
              </Button>
            </Card>
          </div>
        )}
        <Button
          onClick={handleNext}
          colorSchema="green"
          variant="primary"
          className={`w-full ${isCreateVendorPending ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isCreateVendorPending}
        >
          Create Vendor
        </Button>
      </div>
    </div >
  )
}
