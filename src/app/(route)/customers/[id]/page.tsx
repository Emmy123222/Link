"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { IoMdCamera, IoMdCheckmarkCircle } from "react-icons/io"
import CustomerDetailInput from "./customerDetailInput"
import { redirect, useParams } from "next/navigation"
import { useBusinessById } from "@/hooks/use-businesses"
import { Business } from "@/types/business"
import AdditionalData from "./additional-data"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp } from "@/providers/AppProvider"

export default function MyBusinessPage() {
  const router = useRouter()
  const { id } = useParams()
  const { user } = useApp()!
  const { data: businessData } = useBusinessById(id as string)
  const [activeTab, setActiveTab] = useState("Additional data")
  const [business, setBusiness] = useState<Business>(businessData as unknown as Business)
  const [editable, setEditable] = useState(false)
  const guestTabs = ["Additional data", "General details"];

  const searchParams = useSearchParams()

  useEffect(() => {
    if (businessData) {
      setBusiness(businessData as unknown as Business)
    }
  }, [businessData])

  useEffect(() => {
    setEditable(false)
  }, [activeTab])

  // Check if current user can update this customer profile
  // Only allow updates if customer is not validated OR current user is the business owner
  const canUpdateProfile = !business?.active || business?.ownerId === user?.id

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-4 p-8">
      {/* Left sidebar */}
      <div className="w-full md:w-80 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Business logo and name */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-green-100 bg-green-50 flex items-center justify-center text-green-600 text-3xl font-semibold">
                {business?.business_name?.slice(0, 2).toUpperCase() || "KL"}
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 shadow-sm" type="button">
                  <IoMdCamera size={16} className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  // onChange={currentBusiness?.logo_url ? handleLogoUpload : undefined}
                  />
                </button>
              </div>
              {business?.active && (
                <div className="absolute -top-2 -left-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center">
                  <IoMdCheckmarkCircle size={12} className="mr-1" />
                  Validated
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold mt-4">{business?.business_name}</h2>
          </div>

          {/* Navigation tabs */}
          <nav className="space-y-2">
            {guestTabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeTab === tab
                  ? "text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <Button 
            variant="outline" 
            colorSchema="green" 
            size="lg" 
            className="w-full" 
            disabled={!canUpdateProfile}
            onClick={() => {
              setEditable(!editable)
            }}
          >
            Update Profile
          </Button>
          <Button variant="outline" colorSchema="green" size="lg" className="w-full mt-4" onClick={() => {
            if (searchParams.get("type")) {
              redirect(`/add-payment-request/${id}?type=${searchParams.get("type")}`)
            }
          }}>
            Add Payment Request
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto max-h-[80vh]">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "Additional data" && <AdditionalData business={business} setBusiness={setBusiness} editable={editable} />}
          {activeTab === "General details" && <CustomerDetailInput business={business} setBusiness={setBusiness} editable={editable} />}
        </div>
      </div>
    </div >
  )
}
