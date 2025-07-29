'use client'

import React, { useState } from 'react';
import { IoMdArrowBack, IoMdCheckmarkCircle, IoMdMail } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import PaymentLetterModal from '@/components/payment-request/PaymentLetterModal';
import { useCreatePayment, useDeletePaymentRequest } from '@/hooks/use-payment';
import { FaPencilAlt, FaEnvelope, FaFileAlt, FaPlus, FaCheckCircle, FaClock, FaTrash, FaEllipsisH, FaPaperclip, FaComments, FaDownload } from 'react-icons/fa';
import { Menu, MenuItem, MenuTrigger, MenuContent } from '@/components/ui/menu';
import { AddPaymentFormData } from '@/lib/validations/payment-request';
import { useApp } from '@/providers/AppProvider';
import moment from 'moment';
import {
  TransactionSummaryStatus, TransactionSummaryType
} from '@/types/payments';
import MarkAsPaidModal from '@/components/payment-request/MarkAsPaidModal';
import { useRouter } from 'next/navigation';
import { usePaymentRequest } from './PaymentRequestContext';
import { useReopenRequest } from '@/hooks/use-payment';
import { useSendPaymentRequestEmail } from '@/hooks/use-payment';
import { Badge } from '@/components/ui/badge';
interface HeaderProps {
  paymentRequestData: any;
}

const Header = ({ paymentRequestData }: HeaderProps) => {
  const { editable, setEditable, refreshData } = usePaymentRequest();
  const router = useRouter()
  const { currentBusiness } = useApp();
  const [paymentType, setPaymentType] = useState<string>("")
  const [showPaymentLetterModal, setShowPaymentLetterModal] = useState(false);
  const [letterType, setLetterType] = useState<'reminder' | 'action'>('reminder');
  const { paymentReqId } = useParams();
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const { mutateAsync: deletePaymentRequest } = useDeletePaymentRequest()
  const { mutateAsync: reopenRequest } = useReopenRequest()
  const { mutateAsync: sendEmail } = useSendPaymentRequestEmail()
  const handleShowLetter = (type: 'reminder' | 'action') => {
    setLetterType(type);
    setShowPaymentLetterModal(true);
  };

  const menuItems = [
    {
      icon: <FaPencilAlt className="w-5 h-5" />, label: "Edit details", onClick: () => setEditable(!editable), disabled: paymentRequestData.paid_amount < paymentRequestData.amount
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "Reminder letter",
      active: true,
      onClick: () => handleShowLetter('reminder')
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "Letter before action",
      active: true,
      onClick: () => handleShowLetter('action')
    },
    { icon: <FaCheckCircle className="w-5 h-5" />, label: "Mark as paid", active: true, onClick: () => handleMarkModal("Mark as paid") },
    {
      icon: <FaClock className="w-5 h-5 text-gray-400" />, label: "Reopen", active: true, onClick: async () => {
        await reopenRequest(Number(paymentReqId))
      },
      disabled: paymentRequestData.paid_amount < paymentRequestData.amount
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "Add payment",
      active: true,
      onClick: () => handleMarkModal("Add Payment")
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      label: "Add credit note",
      active: true,
      onClick: () => handleMarkModal("Add Credit note")
    },
    {
      icon: <FaTrash className="w-5 h-5 text-red-500" />, label: "Delete", danger: true, onClick: async () => {
        const { error } = await deletePaymentRequest(Number(paymentReqId))
        if (!error) {
          router.push("/payments-in")
        }
      }
    },
  ];

  const { mutateAsync: createPayment } = useCreatePayment();

  const handleAddPayment = async (data: AddPaymentFormData) => {
    const { paymentType, amount, date, description, paymentMethod } = data;

    const payload = {
      created_by: currentBusiness?.ownerId,
      created_at: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
      amount: amount,
      header_id: paymentReqId,
      paymentDate: moment(date).format("YYYY-MM-DDTHH:mm:ssZ"),
      currency: currentBusiness?.currency,
      status: TransactionSummaryStatus.SUCCESSFUL,
      method: paymentMethod,
      description: description,
      type:
        paymentType === "Payment"
          ? TransactionSummaryType.MANUAL_PAYMENT
          : TransactionSummaryType.CREDIT_NOTE,
    }
    const res = await createPayment(payload)
    if (res.status === "success") {
      // Refresh data after successful payment
      refreshData();
    }
  }

  const handleSendEmail = async () => {
    await sendEmail({
      reqId: Number(paymentReqId),
    })
  }

  const handleMarkModal = (type: string) => {
    setPaymentType(type)
    setShowMarkAsPaidModal(true)
  }

  if (!paymentRequestData) return null;
  const downloadPDF = async () => {
    const element = document.getElementById('customer-details-card');
    const html2pdf = (await import('html2pdf.js')).default
    if (!element) return;
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .save();
  };

  return (
    <div className="flex flex-col justify-between items-end gap-2 px-2 w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 relative justify-between w-full">
          <Button variant="outline" size="sm" onClick={downloadPDF}><FaDownload size={22} /> Download</Button>
          <div className="flex items-center gap-2">
            {paymentRequestData.status === 'Draft' ? (
              <Button colorSchema="green" size="sm" onClick={() => handleSendEmail()}><IoMdMail size={22} /> Send to customer</Button>
            ) : (
              <>
                <Button colorSchema="green" size="sm" onClick={() => handleMarkModal("Mark as paid")}><IoMdCheckmarkCircle size={22} /> Mark as paid</Button>
                <Menu>
                  <MenuTrigger>
                    <Button variant="outline" size="sm">
                      <FaEllipsisH className="w-5 h-5" />
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={item.onClick}
                        className={`text-green-400 hover:text-green-800 flex items-center gap-2 ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={item.disabled}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-2">
                            {item.icon}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {item.label}
                          </span>
                        </div>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>
      <PaymentLetterModal
        open={showPaymentLetterModal}
        onClose={() => setShowPaymentLetterModal(false)}
        customer={paymentRequestData.customer}
        letterType={letterType}
        title={letterType === 'reminder' ? 'Payment Reminder Letter' : 'Letter Before Action'}
      />
      <MarkAsPaidModal
        open={showMarkAsPaidModal}
        onClose={() => setShowMarkAsPaidModal(false)}
        onAdd={handleAddPayment}
        title={paymentType}
        type={paymentType as any}
        remaining={paymentRequestData.amount - paymentRequestData.paid_amount}
      />
    </div>
  );
};

export default Header; 