"use client"
import React, { createContext, useContext, useState, JSX } from "react"
import type { Business } from "@/types/business"
export interface IOnboarding {
  business: Business | null
  setBusiness: (business: Business | null) => void
}

const OnboardingContext = createContext<IOnboarding | null>(null)
interface Props {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: Props) {
  const [business, setBusiness] = useState<Business | null>(null)

  return (
    <OnboardingContext.Provider
      value={{
        business,
        setBusiness,
      }}
    >
      <div className='p-3 w-full sm:w-7/8 mx-auto'>
        {children}
      </div >
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
