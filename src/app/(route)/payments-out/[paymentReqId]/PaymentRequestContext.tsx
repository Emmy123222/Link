'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useGetPaymentRequest, useTransactions } from '@/hooks/use-payment';
import { PaymentRequestType } from '@/types/payments';

interface PaymentRequestData {
  id: string;
  customer: {
    name: string;
    email: string;
    mobile_phone_number: string;
    country: { countryName: string };
  };
  vendor: any;
  reference_number: string;
  description: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  created_at: string;
  supply_date: string;
  due_date: string;
  document_number: string;
  payment_done: boolean;
  items: any[];
  payment_method?: string;
  promise_to_pay_date?: string;
  status: string;
  document_type: string;
  attachments: any[];
}

interface PaymentRequestContextType {
  // Data
  paymentRequest: PaymentRequestData | null;
  isLoading: boolean;
  error: Error | null;

  // UI State
  editable: boolean;
  setEditable: (editable: boolean) => void;

  // Computed values
  customer: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    reference_number: string;
    description: string;
    customer: any;
    vendor: any;
    amount: number;
    paid_amount: number;
    remaining_amount: number;
    requestId: string;
    requestDate: string;
    document_number: string;
    supplyDate: string;
    dueDate: string;
    terms: string;
    note: string;
    payment_request_tax: string;
    items: any[];
    document_type: PaymentRequestType;
    payment_done: boolean;
    payment_method: string;
  } | null;

  history: Array<{
    date: string;
    type: string;
    amount: number;
    supplyDate: string;
    dueDate: string;
  }>;

  // Actions
  refreshData: () => void;
}

const PaymentRequestContext = createContext<PaymentRequestContextType | undefined>(undefined);

export const usePaymentRequest = () => {
  const context = useContext(PaymentRequestContext);
  if (context === undefined) {
    throw new Error('usePaymentRequest must be used within a PaymentRequestProvider');
  }
  return context;
};

interface PaymentRequestProviderProps {
  children: ReactNode;
}

export const PaymentRequestProvider: React.FC<PaymentRequestProviderProps> = ({ children }) => {
  const { paymentReqId } = useParams();
  const [editable, setEditable] = useState<boolean>(false);

  const {
    data: paymentRequest,
    isLoading,
    error,
    refetch
  } = useGetPaymentRequest(paymentReqId as string);

  const { data: transactions } = useTransactions(paymentReqId as string);

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  // Calculate total transaction amount
  const totalTransactionAmount = transactions?.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0);
  }, 0) || 0;

  // Compute customer data
  const customer = paymentRequest ? {
    name: paymentRequest.customer?.name || '',
    email: paymentRequest.customer?.email || '',
    phone: paymentRequest.customer?.mobile_phone_number || '',
    countryCode: paymentRequest.customer?.country?.countryName || '',
    reference_number: paymentRequest.reference_number || '',
    description: paymentRequest.description || '',
    customer: paymentRequest.customer,
    vendor: paymentRequest.vendor,
    amount: paymentRequest.amount || 0,
    paid_amount: paymentRequest.paid_amount || 0,
    remaining_amount: (paymentRequest.amount || 0) - totalTransactionAmount,
    requestId: paymentRequest.id,
    payment_request_tax: paymentRequest.payment_request_tax || "",
    note: paymentRequest.note || "",
    terms: paymentRequest.terms_and_conditions || "",
    requestDate: paymentRequest.created_at,
    supplyDate: paymentRequest.supply_date,
    dueDate: paymentRequest.due_date,
    document_number: paymentRequest.document_number || 'PR00000000',
    items: paymentRequest.items || [],
    payment_done: paymentRequest.payment_done || false,
    payment_method: paymentRequest.payment_method || '',
    document_type: paymentRequest.document_type || '',
    status: paymentRequest.status || '',
    attachments: paymentRequest.attachments || [],
  } : null;

  // Compute history data
  const history = paymentRequest?.changes_log || [];

  const value: PaymentRequestContextType = {
    paymentRequest,
    isLoading,
    error,
    editable,
    setEditable,
    customer,
    history,
    refreshData,
  };

  return (
    <PaymentRequestContext.Provider value={value}>
      {children}
    </PaymentRequestContext.Provider>
  );
}; 