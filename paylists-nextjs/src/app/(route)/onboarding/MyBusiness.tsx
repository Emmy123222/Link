"use client"

import { useState } from 'react'
import ConfirmBusinessEmail from './ConfirmBusinessEmail'
import ConfirmLLP from './ConfirmLLP';
import BusinessDetail from './BusinessDetail';
import { Image } from '@/components/ui/image';

type AccountType = "business" | "personal"

interface MyBusinessProps {
  onNext: () => void;
  onBack: () => void;
  accountType: AccountType | null;
}

export default function MyBusiness({ onNext, onBack, accountType }: MyBusinessProps) {
  const [step, setStep] = useState(1)

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
      {/* Left side - Illustration */}
      <div className="hidden md:w-1/2 md:flex justify-center items-center p-8">
        <Image src="/images/business.svg" alt="Onboarding illustration" width={500} height={500} priority />
      </div>
      <div className="w-full md:w-1/2 ">
        {step === 1 && <ConfirmBusinessEmail next={() => setStep(prev => prev + 1)} />}
        {step === 2 && <ConfirmLLP next={() => setStep(prev => prev + 1)} />}
        {step === 3 && <BusinessDetail next={onNext} onBack={onBack} />}
      </div>
    </div>
  )
}