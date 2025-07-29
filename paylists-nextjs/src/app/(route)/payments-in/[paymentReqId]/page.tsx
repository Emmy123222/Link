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
import { Card, CardContent } from '@/components/ui/card';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';

const PaymentRequestDetailsContent = () => {
  const router = useRouter();
  const { isLoading, customer } = usePaymentRequest();
  const { setTitle } = useNavbarTitle();
  const { paymentRequest, editable } = usePaymentRequest();
  const { data, refetch } = useGetPaymentRequest(paymentRequest?.id as string)
  const [paymentRequestData, setPaymentRequestData] = useState<any>(null)

  useEffect(() => {
    if (editable) {
      refetch()
    }
  }, [editable])

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
      setPaymentRequestData({ ...paymentRequestData, ...payload })
    }
  })

  useEffect(() => {
    console.log(paymentRequestData)
  }, [paymentRequestData])

  useEffect(() => {
    if (customer) {
      setTitle(`Payment receive from ${customer.customer.business_name}`);
    }
    return () => setTitle("");
  }, [customer, setTitle]);

  if (isLoading) return <div>Loading...</div>;
  if (!customer || !paymentRequestData) return <div>Payment request not found</div>;

  const SimpleCustomerDetailsCard = () => {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
          <div className="space-y-2 grid grid-cols-2 items-center justify-between">
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Name:</span>
              <span className="text-foreground font-medium break-words">{paymentRequestData?.customer?.business_name}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Email:</span>
              <span className="text-foreground break-all">{paymentRequestData?.customer?.email}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Contact Person:</span>
              <span className="text-foreground break-all">{paymentRequestData?.customer?.name}</span>
            </div>
            <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Phone:</span>
              <span className="text-foreground break-words">{paymentRequestData?.customer?.mobile_phone_number}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-background p-4 space-y-4">
      <div className="flex flex-col gap-4">
        <button className="w-full max-w-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.push('/payments-in')}>
          <IoMdArrowBack size={20} />
          <span className="text-sm">Back</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <SimpleCustomerDetailsCard />
        </div>
        <div>
          <CustomerUpdates paymentRequestData={paymentRequestData} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 sm:gap-6 order-2 lg:order-1 max-h-[80vh] overflow-y-auto relative">
          <CustomerDetailsCard paymentRequestData={paymentRequestData} />
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