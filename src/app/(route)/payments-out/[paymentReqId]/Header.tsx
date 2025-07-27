'use client'

import React, { useState } from 'react';
import { IoMdMail } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useCreatePayment, useDeletePaymentRequest } from '@/hooks/use-payment';
import { FaPencilAlt, FaEnvelope, FaFileAlt, FaClock, FaTrash, FaEllipsisH } from 'react-icons/fa';
import { Menu, MenuItem, MenuTrigger, MenuContent } from '@/components/ui/menu';
import { AddPaymentFormData } from '@/lib/validations/payment-request';
import { useApp } from '@/providers/AppProvider';
import moment from 'moment';
import {
  TransactionSummaryStatus, TransactionSummaryType
} from '@/types/payments';
import { useRouter } from 'next/navigation';
import { usePaymentRequest } from './PaymentRequestContext';
import { useReopenRequest } from '@/hooks/use-payment';
import { useSendPaymentRequestEmail } from '@/hooks/use-payment';
import { Badge } from '@/components/ui/badge';
interface HeaderProps {
  paymentRequestData: any;
}

const Header = ({ paymentRequestData }: HeaderProps) => {
  return (
    <div className="flex flex-col justify-between items-end gap-2 px-2 w-full">
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <Badge variant={paymentRequestData?.status === 'Paid' ? 'success' : 'error'} className="flex items-center">
          {paymentRequestData?.status}
        </Badge>
        <span className="text-gray-500 text-sm">
          {paymentRequestData.document_type.slice(0, 2).toUpperCase()} {paymentRequestData?.document_number}
        </span>
      </div>
    </div>
  );
};

export default Header; 