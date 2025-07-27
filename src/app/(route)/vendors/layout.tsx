"use client"

import { useApp } from '@/providers/AppProvider'
import React, { createContext, useEffect, useState, useContext } from 'react'

// Type definitions
type VendorsContextType = {
  vendors: any[];
  setVendors: (vendors: any[]) => void;
};

// Context creation
const VendorsContext = createContext<VendorsContextType | undefined>(undefined);

export default function VendorsLayout({ children }: { children: React.ReactNode }) {
  const { currentBusiness } = useApp()!;
    const [vendors, setVendors] = useState<any[]>([]);

  return (
    <VendorsContext.Provider value={{ vendors, setVendors }}>
      {currentBusiness ? (children) : <div className='flex justify-center items-center h-full'>Select your business to view vendors</div>}
    </VendorsContext.Provider>
  );
}

// Custom hook
export const useVendorsContext = () => {
  const context = useContext(VendorsContext);
  if (!context) {
    throw new Error('useVendorsContext must be used within a VendorsLayout');
  }
  return context;
};
