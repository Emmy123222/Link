"use client"

import React, { createContext, useContext, useState } from 'react';
import { Business } from '@/types/business';

type VendorFormContextType = {
  formData: Business;
  updateFormData: (data: Partial<Business>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const VendorFormContext = createContext<VendorFormContextType | undefined>(undefined);

export function VendorFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Business>({} as Business);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<Business>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <VendorFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </VendorFormContext.Provider>
  );
}

export function useVendorForm() {
  const context = useContext(VendorFormContext);
  if (context === undefined) {
    throw new Error('useVendorForm must be used within a VendorFormProvider');
  }
  return context;
}