"use client"

import React from 'react'
import ConfirmCustomerType from "./ConfirmCustomerType";
import CustomerDetail from "./CustomerDetail";
import ConfirmCustomerName from "./ConfirmCustomerName";
import PrivateCustomerDetail from "./PrivateCustomerDetail";
import ConfirmCustomerEmail from "./ConfirmCustomerEmail";
import FinishStep from "./FinishStep";
import ProgressBar from "@/components/progressBar";
import { Image } from "@/components/ui/image";
import { CustomerFormProvider, useCustomerForm } from './CustomerFormContext';
import { STEPS } from './config';

function AddCustomerContent() {
  const { currentStep } = useCustomerForm();
  const currentProgressStep = currentStep === 6 ? 2 : 1;

  return (
    <div className='p-3 w-full sm:w-7/8 mx-auto bg-background'>
      <ProgressBar currentStep={currentProgressStep} steps={["Customer details", "Finish"]} />
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        <div className="hidden md:w-1/2 md:flex justify-center items-center p-8">
          <Image src="/images/business.svg" alt="Business illustration" width={500} height={500} priority />
        </div>
        <div className="w-full md:w-1/2 p-4">
          {currentStep === STEPS.CONFIRM_NAME && <ConfirmCustomerName />}
          {currentStep === STEPS.CONFIRM_EMAIL && <ConfirmCustomerEmail />}
          {currentStep === STEPS.CONFIRM_TYPE && <ConfirmCustomerType />}
          {currentStep === STEPS.BUSINESS_DETAILS && <CustomerDetail />}
          {currentStep === STEPS.PRIVATE_DETAILS && <PrivateCustomerDetail />}
          {currentStep === STEPS.FINISH && <FinishStep />}
        </div>
      </div>
    </div>
  )
}

export default function AddCustomerPage() {
  return (
    <CustomerFormProvider>
      <AddCustomerContent />
    </CustomerFormProvider>
  )
}