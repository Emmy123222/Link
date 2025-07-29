import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePaymentRequest } from './PaymentRequestContext';
import UnifiedPaymentForm from '@/form/UnifiedPaymentForm';
import { PaymentRequestType } from '@/types/payments';
import InvoiceItemsTable from './InvoiceItemsTable';
import PaymentSoFarModal from '@/components/paymentSoFarModal';
import Header from './Header';
import { formatDate, formatCurrency } from '@/utils/utils';
import { useAddAttachment, useDeleteAttachment, useUploadAttachment } from '@/hooks/use-payment';
import IFrame from "react-iframe"
import { IoClose } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Type for payment request data
interface PaymentRequestData {
  partial_payment: string;
  reference_number: string;
  status: string;
  id: string;
  request_date?: string;
  supply_date?: string;
  due_date?: string;
  amount?: number;
  paid_amount?: number;
  document_type?: PaymentRequestType;
  document_number?: string;
  description?: string;
  terms?: string;
  note?: string;
  customer?: {
    name?: string;
    email?: string;
    mobile_phone_number?: string;
  };
  items?: any[];
  attachments?: Attachment[];
}

interface Attachment {
  publicUrl: string;
  fileName: string;
  storagePath: string;
}

const CustomerDetailsCard = ({ paymentRequestData }: { paymentRequestData: PaymentRequestData }) => {
  const { editable, setEditable } = usePaymentRequest();
  const [isPaymentSoFarModalOpen, setIsPaymentSoFarModalOpen] = useState(false);
  const formattedDates = useMemo(() => ({
    requestDate: formatDate(paymentRequestData?.request_date || ''),
    supplyDate: formatDate(paymentRequestData?.supply_date || ''),
    dueDate: formatDate(paymentRequestData?.due_date || '')
  }), [paymentRequestData?.request_date, paymentRequestData?.supply_date, paymentRequestData?.due_date]);

  const { mutateAsync: uploadAttachment } = useUploadAttachment();
  const [attachments, setAttachments] = useState<any[]>([]);
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();
  const { mutate: addAttachment } = useAddAttachment();
  const formattedAmounts = useMemo(() => ({
    amount: formatCurrency(paymentRequestData?.amount || 0),
    paid: formatCurrency(paymentRequestData?.paid_amount || 0),
    remaining: formatCurrency((paymentRequestData?.amount || 0) - (paymentRequestData?.paid_amount || 0))
  }), [paymentRequestData?.amount, paymentRequestData?.paid_amount]);

  useEffect(() => {
    if (paymentRequestData?.attachments && paymentRequestData.attachments.length > 0) {
      setAttachments(paymentRequestData?.attachments || []);
    }
  }, [paymentRequestData?.attachments]);

  if (!paymentRequestData) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Customer information not available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-4 '>
      <div id="customer-details-card">
        <Header paymentRequestData={paymentRequestData} />
        <Card className="py-4 space-y-4 px-6 max-h-[60vh] overflow-y-auto mt-4">

          <div className='flex flex-row items-center justify-between gap-2 w-full sticky top-0 bg-white z-10'>
            <div className="flex flex-row items-center justify-between gap-2">
              <Badge variant={paymentRequestData?.status === 'Paid' ? 'success' : 'error'} className="flex items-center">
                {paymentRequestData?.status}
              </Badge>
            </div>
            <span className="text-gray-500 text-sm font-medium">
              {paymentRequestData?.document_type?.slice(0, 2).toUpperCase()} {paymentRequestData?.document_number}
            </span>
          </div>
          {!editable ? (
            <>
              <div className="space-y-4 ">
                {/* Payment Information Section */}
                <section className="space-y-4">
                  <div className='flex flex-row items-center '>
                    <span className='text-gray-600 whitespace-nowrap'>{paymentRequestData?.document_type?.slice(0, 2).toUpperCase()}</span>
                    <span className='text-gray-900 break-words'>{paymentRequestData?.document_number}</span>
                  </div>
                  <div className="flex flex-col justify-between gap-2 text-sm sm:flex-row flex-wrap mt-6">
                    <div className="flex gap-2">
                      <span className="text-gray-600 whitespace-nowrap">Request Date:</span>
                      <span className="text-gray-900 break-words">{formattedDates.requestDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 whitespace-nowrap">Supply Date:</span>
                      <span className="text-gray-900 break-words">{formattedDates.supplyDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 whitespace-nowrap">Due Date:</span>
                      <span className="text-gray-900 break-words">{formattedDates.dueDate}</span>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <span className='text-gray-600 whitespace-nowrap'>Description:</span>
                    <span className='text-gray-900 break-words'>{paymentRequestData?.description}</span>
                  </div>
                  <div className='flex gap-2 justify-between'>
                    <div className='flex gap-2'>
                      <span className='text-gray-600 whitespace-nowrap'>Reference:</span>
                      <span className='text-gray-900 break-words'>{paymentRequestData?.reference_number}</span>
                    </div>
                    <div className='flex gap-2'>
                      <span className='text-gray-600 whitespace-nowrap'>Partial Payment:</span>
                      <span className='text-gray-900 break-words'>{paymentRequestData?.partial_payment ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </section>

                {/* Payment Summary */}
                <section className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Total Amount</span>
                      <span className="font-semibold text-lg text-gray-900">
                        {formattedAmounts.amount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Paid So Far</span>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setIsPaymentSoFarModalOpen(true)
                      }}>
                        <span className="text-gray-700 underline">
                          {formattedAmounts.paid}
                        </span>
                      </Button>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium text-gray-700">Remaining</span>
                      <span className="font-semibold text-gray-900">
                        {formattedAmounts.remaining}
                      </span>
                    </div>
                  </div>
                </section>
                <InvoiceItemsTable
                  items={paymentRequestData?.items || []}
                  documentType={paymentRequestData?.document_type || ''}
                />
                {attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2 ">
                    {attachments.map((attachment: any, index: number) => (
                      <div key={index} className="flex flex-col gap-2 items-center relative">
                        <Button className="absolute top-0 right-0 w-10 h-10" variant="secondary" onClick={() => {
                          deleteAttachment({ id: Number(paymentRequestData.id), item: attachment }).then(() => {
                            setAttachments(attachments.filter((_, i) => i !== index))
                          })
                        }}><IoClose size={20} /></Button>
                        <IFrame url={attachment.publicUrl} className="w-[200px] h-[200px]" />
                        <Button variant="ghost" size="sm" onClick={() => {
                          window.open(attachment.publicUrl, '_blank')
                        }}>
                          <span className="text-gray-700 underline text-sm">
                            View
                          </span>
                        </Button>
                      </div>
                    ))}
                    <Input type="file" multiple={false} onChange={async (e) => {
                      const files = e.target.files
                      if (files) {
                        const file = files[0]
                        const folder = Date.now().toString();
                        const res = await uploadAttachment({
                          files: [file],
                          folder: folder,
                          bucket: 'documents'
                        })
                        if (res) {
                          const result = await addAttachment({
                            id: Number(paymentRequestData.id),
                            attachments:
                            {
                              publicUrl: res[0].publicUrl,
                              fileName: file.name,
                              storagePath: res[0].storagePath,
                            }
                          })
                          setAttachments([...attachments, {
                            publicUrl: res[0].publicUrl,
                            fileName: file.name,
                            storagePath: res[0].storagePath,
                          }])
                        }
                      }
                      e.target.files = null
                    }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-4 w-full'>
              <UnifiedPaymentForm
                type={paymentRequestData?.document_type as PaymentRequestType}
                mode="update"
                back={() => {
                  setEditable(false)
                }}
                existingData={paymentRequestData as any}
              />
            </div>
          )}
        </Card>

        {/* Invoice Items Table - Only shown for Invoice type */}
      </div >
      {
        isPaymentSoFarModalOpen && (<PaymentSoFarModal
          isOpen={isPaymentSoFarModalOpen}
          onClose={() => setIsPaymentSoFarModalOpen(false)}
        />)
      }
    </div >
  );
};

CustomerDetailsCard.displayName = 'CustomerDetailsCard';

export default CustomerDetailsCard; 