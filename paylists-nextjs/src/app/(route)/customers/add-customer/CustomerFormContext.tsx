"use client"

import React, { createContext, useContext, useState } from 'react';
import { Business } from '@/types/business';

type CustomerFormContextType = {
  formData: Business;
  updateFormData: (data: Partial<Business>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const CustomerFormContext = createContext<CustomerFormContextType | undefined>(undefined);

export function CustomerFormProvider({ children }: { children: React.ReactNode }) {
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
    <CustomerFormContext.Provider
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
    </CustomerFormContext.Provider>
  );
}

export function useCustomerForm() {
  const context = useContext(CustomerFormContext);
  if (context === undefined) {
    throw new Error('useCustomerForm must be used within a CustomerFormProvider');
  }
  return context;
}