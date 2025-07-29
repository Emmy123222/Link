"use client"

import React from 'react'
import ConfirmVendorName from "./ConfirmVendorName";
import VendorDetail from "./VendorDetail";
import ConfirmVendorEmail from "./ConfirmVendorEmail";
import FinishStep from "./FinishStep";
import ProgressBar from "@/components/progressBar";
import { Image } from "@/components/ui/image";
import { VendorFormProvider, useVendorForm } from './VendorFormContext';
import { STEPS } from './config';

function AddVendor() {
  const { currentStep } = useVendorForm();
  const currentProgressStep = currentStep === 4 ? 2 : 1;

  return (
    <div className='p-3 w-full sm:w-7/8 mx-auto bg-background'>
      <ProgressBar currentStep={currentProgressStep} steps={["Vendor details", "Finish"]} />
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        <div className="hidden md:w-1/2 md:flex justify-center items-center p-8">
          <Image src="/images/business.svg" alt="Business illustration" width={500} height={500} priority />
        </div>
        <div className="w-full md:w-1/2 p-8">
          {currentStep === STEPS.CONFIRM_NAME && <ConfirmVendorName />}
          {currentStep === STEPS.CONFIRM_EMAIL && <ConfirmVendorEmail />}
          {currentStep === STEPS.BUSINESS_DETAILS && <VendorDetail />}
          {currentStep === STEPS.FINISH && <FinishStep />}
        </div>
      </div>
    </div>
  )
}

export default function AddVendorPage() {
  return (
    <VendorFormProvider>
      <AddVendor />
    </VendorFormProvider>
  )
}