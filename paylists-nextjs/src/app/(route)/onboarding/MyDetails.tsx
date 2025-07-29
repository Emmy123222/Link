"use client"

import React, { useState, useEffect } from "react";
import SendPhoneNumber from "./SendPhoneNumber";
import PersonalDetailsPage from "./PersonalDetailsPage";
import { Image } from "@/components/ui/image";
import { useApp } from "@/providers/AppProvider";

interface MyDetailsProps {
  onNext: () => void;
}

export default function MyDetails({ onNext }: MyDetailsProps) {
  const { user } = useApp()
  const [step, setStep] = useState(1)

  // If user already has a verified phone number, skip to personal details
  useEffect(() => {
    if (user?.phone && user?.label) {
      setStep(2)
    }
  }, [user])

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto">
      <div className="hidden md:w-1/2 md:flex justify-center items-center">
        <Image src="/images/account-phone.svg" alt="Onboarding illustration" width={500} height={500} priority />
      </div>
      <div className="w-full md:w-1/2">
        {step === 1 && <SendPhoneNumber key={1} next={() => setStep(prev => prev + 1)} />}
        {step === 2 && <PersonalDetailsPage next={onNext} />}
      </div>
    </div>
  )
}
