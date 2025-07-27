"use client"

import React, { useEffect, useState } from 'react'
import MyBusiness from './MyBusiness'
import MyDetails from './MyDetails'
import Finish from './Finish'
import AccountTypeSelection from './AccountTypeSelection'
import ProgressBar from "@/components/progressBar"
// import { useVerifyCodeFromEmail } from '@/hooks/use-businesses'
// import { useSearchParams } from 'next/navigation'
import { useApp } from '@/providers/AppProvider'

const steps = [
  "My details",
  "Account type",
  "Create Business",
  "Finish"
]

type AccountType = "business" | "personal"

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const { user } = useApp()
  // const searchParams = useSearchParams();
  // const code = searchParams.get("code");
  // const email = searchParams.get("email");
  // const { mutateAsync: verifyCodeFromEmail } = useVerifyCodeFromEmail()
  // // if (!code || !email) return;
  // // const verify = async () => {
  // //   if (res.data) {
  // //     // setBusiness({ id: res.data.businessId })
  // //     setStep(2)
  // //   }
  // // };

  // // verify();

  // // const res = await verifyCodeFromEmail({ business: { email: email as string }, code });
  // Remove the automatic step skipping useEffect
  // Let the user flow through all steps naturally

  // Check if user has already completed their personal details
  useEffect(() => {
    if (user && !user.guest_user) {
      // User has already completed their details, skip to account type selection
      setStep(2)
    }
  }, [user])

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const handleAccountTypeSelection = (selectedAccountType: AccountType) => {
    setAccountType(selectedAccountType)
    if (selectedAccountType === "personal") {
      // Skip business creation for personal accounts
      setStep(4) // Go directly to Finish
    } else {
      setStep(3) // Go to Create Business for business accounts
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MyDetails onNext={handleNext} />
      case 2:
        return <AccountTypeSelection onNext={handleAccountTypeSelection} />
      case 3:
        return <MyBusiness onNext={handleNext} onBack={handleBack} accountType={accountType} />
      case 4:
        return <Finish onBack={handleBack} accountType={accountType} />
      default:
        return null
    }
  }

  const getProgressSteps = () => {
    if (accountType === "personal") {
      return ["My details", "Account type", "Finish"]
    }
    return steps
  }

  const getProgressStep = () => {
    if (accountType === "personal") {
      if (step === 4) return 3 // Finish step for personal
      return step
    }
    return step
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ProgressBar steps={getProgressSteps()} currentStep={getProgressStep()} />
      <div className="mt-4">
        {renderStep()}
      </div>
    </div>
  )
}