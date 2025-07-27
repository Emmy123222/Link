'use client'

import React, { useState, useEffect } from 'react';
import CustomerDetailsCard from './CustomerDetailsCard';
import CustomerUpdates from './CustomerUpdates';
import { PaymentRequestProvider, usePaymentRequest } from './PaymentRequestContext';
import MessageInputBar from '@/components/message/MessageInputBar';
import Timeline from '@/components/Timeline';
import { useNavbarTitle } from '@/context/NavbarTitleContext';
import { useGetPaymentRequest } from '@/hooks/use-payment';
import { useRealtimeListener } from '@/hooks/use-realtime-listener';
import Header from './Header';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const PaymentRequestDetailsContent = () => {
  const router = useRouter();
  const { isLoading, customer } = usePaymentRequest();
  const { setTitle } = useNavbarTitle();
  const { paymentRequest } = usePaymentRequest();
  const { data } = useGetPaymentRequest(paymentRequest?.id as string)
  const [paymentRequestData, setPaymentRequestData] = useState<any>(null)

  useEffect(() => {
    setPaymentRequestData(data)
  }, [data])

  useRealtimeListener({
    channelName: 'payment_requests',
    table: 'Document_header',
    event: '*',
    schema: 'public',
    filter: `id=eq.${paymentRequest?.id}`,
    onChange: (payload) => {
      console.log(payload)
      setPaymentRequestData({ ...paymentRequestData, ...payload })
    }
  })

  useEffect(() => {
    if (customer) {
      setTitle(`Payment to ${customer.vendor.business_name}`);
    }
    return () => setTitle("");
  }, [customer, setTitle]);

  if (isLoading) return <div>Loading...</div>;
  if (!customer || !paymentRequestData) return <div>Payment request not found</div>;

  const SimpleCustomerDetailsCard = () => {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
          <div className="space-y-2 grid grid-cols-2 items-center justify-between">
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-gray-600  whitespace-nowrap">Name:</span>
              <span className="text-gray-900 font-medium break-words">{paymentRequest?.vendor?.business_name}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-gray-600 whitespace-nowrap">Email:</span>
              <span className="text-gray-900 break-all">{paymentRequest?.vendor?.email}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-gray-600 whitespace-nowrap">Contact Person:</span>
              <span className="text-gray-900 break-all">{paymentRequest?.vendor?.name}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-gray-600 whitespace-nowrap">Phone:</span>
              <span className="text-gray-900 break-words">{paymentRequest?.vendor?.mobile_phone_number}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-[#f6fbf7] p-4 space-y-4">
      <div className="flex flex-col gap-4">
        <button className="w-full max-w-xs flex items-center gap-2" onClick={() => router.push('/payments-out')}>
          <IoMdArrowBack size={20} />
          <span className="text-sm">Back</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <SimpleCustomerDetailsCard />
        </div>
        <div>
          <CustomerUpdates paymentRequest={paymentRequestData} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 sm:gap-6 order-2 lg:order-1 max-h-[80vh] overflow-y-auto relative">
          <Header />
          <CustomerDetailsCard paymentRequest={paymentRequest} />
        </div>
        <div className="flex flex-col gap-4 order-1 lg:order-2">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div>
              <Timeline className="bg-transparent max-h-[50vh] overflow-y-auto" vendorName={customer.vendor.name} customerName={customer.customer.name} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <MessageInputBar />
          </div>
        </div>
      </div>

    </div >
  );
};

const PaymentRequestDetailsPage = () => {
  return (
    <PaymentRequestProvider>
      <PaymentRequestDetailsContent />
    </PaymentRequestProvider>
  );
};

export default PaymentRequestDetailsPage; 