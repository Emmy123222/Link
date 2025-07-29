import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeleteAttachment, useUploadAttachment } from '@/hooks/use-payment';
import InvoiceItemsTable from './InvoiceItemsTable';
import PaymentSoFarModal from '@/components/paymentSoFarModal';
import { formatDate, formatCurrency } from '@/utils/utils';
import { IoClose } from 'react-icons/io5';
import IFrame from "react-iframe";
import { Input } from '@/components/ui/input';

interface Attachment {
  publicUrl: string;
  fileName: string;
  storagePath: string;
}


const CustomerDetailsCard = ({ paymentRequest }: { paymentRequest: any }) => {
  const [isPaymentSoFarModalOpen, setIsPaymentSoFarModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { mutateAsync: addAttachment } = useUploadAttachment();
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();
  const { mutateAsync: uploadAttachment } = useUploadAttachment();
  const formattedDates = useMemo(() => ({
    requestDate: formatDate(paymentRequest?.request_date || ''),
    supplyDate: formatDate(paymentRequest?.supply_date || ''),
    dueDate: formatDate(paymentRequest?.due_date || '')
  }), [paymentRequest?.request_date, paymentRequest?.supply_date, paymentRequest?.due_date]);

  const formattedAmounts = useMemo(() => ({
    amount: formatCurrency(paymentRequest?.amount || 0),
    paid: formatCurrency(paymentRequest?.paid_amount || 0),
    remaining: formatCurrency(paymentRequest?.amount - paymentRequest?.paid_amount || 0)
  }), [paymentRequest?.amount, paymentRequest?.paid_amount]);

  if (!paymentRequest) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Vendor information not available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div id="customer-details-card">
        <Card className="mb-4 p-6">
          <div className='flex flex-row items-center justify-between gap-2 w-full sticky top-0 bg-white z-10'>
            <div className="flex flex-row items-center justify-between gap-2">
              <Badge variant={paymentRequest?.status === 'Paid' ? 'success' : 'error'} className="flex items-center">
                {paymentRequest?.status}
              </Badge>
            </div>
            <span className="text-gray-500 text-sm font-medium">
              {paymentRequest?.document_type?.slice(0, 2).toUpperCase()} {paymentRequest?.document_number}
            </span>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4 ">
              {/* Payment Information Section */}
              <section className="space-y-4">
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
                  <span className='text-gray-900 break-words'>{paymentRequest?.description}</span>
                </div>
                <div className='flex gap-2 justify-between'>
                  <div className='flex gap-2'>
                    <span className='text-gray-600 whitespace-nowrap'>Reference:</span>
                    <span className='text-gray-900 break-words'>{paymentRequest?.reference_number}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='text-gray-600 whitespace-nowrap'>Partial Payment:</span>
                    <span className='text-gray-900 break-words'>{paymentRequest?.partial_payment ? 'Yes' : 'No'}</span>
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
                items={paymentRequest?.items || []}
                documentType={paymentRequest?.document_type || ''}
              />
              {attachments?.length > 0 && (
                <div className="flex flex-wrap gap-2 ">
                  {attachments.map((attachment: Attachment, index: number) => (
                    <div key={index} className="flex flex-col gap-2 items-center relative">
                      <Button className="absolute top-0 right-0 w-10 h-10" variant="secondary" onClick={() => {
                        deleteAttachment({ id: Number(paymentRequest.id), item: attachment }).then(() => {
                          setAttachments(attachments.filter((_: Attachment, i: number) => i !== index))
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
                  <Input type="file" multiple={false} onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                          files: [file],
                          folder: folder,
                          bucket: 'documents',
                        })
                        if (result) {
                          setAttachments([...attachments, {
                            publicUrl: res[0].publicUrl,
                            fileName: file.name,
                            storagePath: res[0].storagePath,
                          }])
                        }
                      }
                    }
                    e.target.files = null
                  }} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <InvoiceItemsTable
          items={paymentRequest?.items || []}
          documentType={paymentRequest.document_type || ''}
        />

        {paymentRequest?.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {paymentRequest?.attachments.map((attachment: any, index: number) => (
              <iframe key={index} src={attachment.publicUrl} className="w-[200px] h-[200px]" />
            ))}
          </div>
        )}
      </div>
      <PaymentSoFarModal
        isOpen={isPaymentSoFarModalOpen}
        onClose={() => setIsPaymentSoFarModalOpen(false)}
      />
    </div >
  );
};

CustomerDetailsCard.displayName = 'CustomerDetailsCard';

export default CustomerDetailsCard; 