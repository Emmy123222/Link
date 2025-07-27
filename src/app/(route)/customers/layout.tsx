"use client"

import React, { createContext, useContext, useState } from 'react';
import { useApp } from '@/providers/AppProvider';
import { canCreateCustomers, getPersonalBusinessRestrictionsMessage } from '@/utils/businessUtils';

interface CustomersContextType {
  customers: any[];
  setCustomers: (customers: any[]) => void;
}

// Context creation
const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  const { currentBusiness } = useApp()!;
  const [customers, setCustomers] = useState<any[]>([]);

  // If no business is selected
  if (!currentBusiness) {
    return (
      <CustomersContext.Provider value={{ customers, setCustomers }}>
        <div className='flex justify-center items-center h-full'>Select your business to view customers</div>
      </CustomersContext.Provider>
    );
  }

  // If personal business (cannot create customers)
  if (!canCreateCustomers(currentBusiness)) {
    return (
      <CustomersContext.Provider value={{ customers, setCustomers }}>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center max-w-md">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Customer Management Not Available</h3>
            <p className="text-blue-700 mb-6">{getPersonalBusinessRestrictionsMessage()}</p>
            <div className="space-y-2 text-sm text-blue-600">
              <p><strong>What you can do with a Personal Account:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Receive and pay invoices</li>
                <li>Manage your personal payments</li>
                <li>View payment history</li>
              </ul>
            </div>
          </div>
        </div>
      </CustomersContext.Provider>
    );
  }

  return (
    <CustomersContext.Provider value={{ customers, setCustomers }}>
      {children}
    </CustomersContext.Provider>
  );
}

// Custom hook
export const useCustomersContext = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomersContext must be used within a CustomersLayout');
  }
  return context;
};
