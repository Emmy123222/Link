"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { IoMdCamera, IoMdCheckmarkCircle } from "react-icons/io"
import BusinessDetailInput from "./businessDetailInput"
import BankDetailInput from "./bankDetailInput"
import LegalInput from "./legalInput"
import GeneralInput from "./generalInput"
import { useApp } from "@/providers/AppProvider"
import { BusinessConfig } from "@/constants/businessConfig"
import { Button } from "@/components/ui/button"

export default function MyBusinessPage() {
  const [activeTab, setActiveTab] = useState(BusinessConfig.tabs.owner[0])
  const [editable, setEditable] = useState<boolean>(false)
  const { currentBusiness, businesses, setBusinesses } = useApp()!

  useEffect(() => {
    setEditable(false)
  }, [activeTab])

  useEffect(() => {
    if (currentBusiness) {
      setBusinesses(businesses.map(business => business.id === currentBusiness.id ? currentBusiness : business))
    }
  }, [currentBusiness])

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-4 p-8 justify-start">
      {/* Left sidebar */}
      <div className="w-full md:w-1/3 space-y-4">
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          {/* Business logo and name */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-green-100 bg-green-50 flex items-center justify-center text-green-600 text-3xl font-semibold">
                {currentBusiness?.business_name?.slice(0, 2).toUpperCase() || "KL"}
                <button className="absolute bottom-0 right-0 bg-card rounded-full p-1 border shadow-sm" type="button">
                  <IoMdCamera size={16} className="text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </button>
              </div>
              {currentBusiness?.active && (
                <div className="absolute -top-2 -left-2 bg-muted text-foreground text-xs px-2 py-1 rounded-full flex items-center">
                  <IoMdCheckmarkCircle size={12} className="mr-1" />
                  Validated
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold mt-4">{currentBusiness?.business_name}</h2>
          </div>

          {/* Navigation tabs */}
          <nav className="space-y-2">
            {currentBusiness && BusinessConfig.tabs.owner.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeTab === tab
                  ? "text-green-700 font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <Button variant="outline" colorSchema="green" className="w-full mt-4" onClick={() => setEditable(!editable)}>Update Profile</Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto max-h-[80vh] max-w-3xl">
        {currentBusiness ? (<div className="bg-card rounded-lg shadow-sm p-6">
          {activeTab === "General" && <GeneralInput editable={editable} />}
          {activeTab === "Business details" && <BusinessDetailInput editable={editable} />}
          {activeTab === "Bank details" && <BankDetailInput editable={editable} />}
          {activeTab === "Legal & commercial" && <LegalInput editable={editable} />}
        </div>) : (<div className='flex justify-center items-center h-full text-muted-foreground'>Select your business to view customers</div>)}
      </div>
    </div>
  )
}
