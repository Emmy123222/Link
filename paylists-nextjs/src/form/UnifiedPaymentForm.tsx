import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePaymentRequest, useUpdatePaymentRequest, useUploadAttachment, useDeleteItem } from '@/hooks/use-payment';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import Checkbox from '@/components/ui/checkbox';
import { useApp } from '@/providers/AppProvider';
import { Business } from '@/types/business';
import { PaymentRequestType } from '@/types/payments';
import moment from 'moment';
import AttachmentField from '@/components/ui/AttachmentField';
import { canSendInvoices, getPersonalBusinessRestrictionsMessage } from '@/utils/businessUtils';

// Invoice item schema with enhanced validation
const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name must be less than 100 characters'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be greater than 0').max(999999, 'Quantity must be less than 999,999'),
  unit_price: z.coerce.number().min(0.01, 'Unit price must be greater than 0').max(999999, 'Unit price must be less than 999,999'),
  tax_rate: z.coerce.number().min(1, 'Tax rate must be at least 1').max(2, 'Tax rate must be less than 200%'),
  amount: z.coerce.number().min(0, 'Amount must be calculated'),
  tax_amount: z.coerce.number().min(0, 'Tax amount must be calculated'),
  totalAmount: z.coerce.number().min(0, 'Total amount must be calculated'),
});

// Invoice form schema with enhanced validation
const invoiceFormSchema = z.object({
  requestDate: z.string().min(1, 'Request date is required'),
  supplyDate: z.string().min(1, 'Supply date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  allowPartialPayments: z.string().min(1, 'Please select partial payment option'),
  currency: z.string().min(1, 'Currency is required'),
  referenceNumber: z.string().optional(),
  amountsAre: z.string().min(1, 'Please select amount type'),
  termsAndConditions: z.string().max(500, 'Terms & conditions must be less than 500 characters').optional(),
  note: z.string().max(500, 'Note must be less than 500 characters').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required').max(100, 'Maximum 100 items allowed'),
  roundTotalAmount: z.boolean().default(false),
  amount: z.coerce.number().optional(),
}).refine((data) => {
  // Validate that request date is not in the past
  const requestDate = moment(data.requestDate as string);
  const today = moment().startOf('day');
  return requestDate.isSameOrAfter(today);
}, {
  message: "Request date cannot be in the past",
  path: ["requestDate"],
}).refine((data) => {
  // Validate that due date is not before request date
  const requestDate = moment(data.requestDate as string);
  const dueDate = moment(data.dueDate as string);
  return dueDate.isSameOrAfter(requestDate);
}, {
  message: "Due date cannot be before request date",
  path: ["dueDate"],
}).refine((data) => {
  // Validate that supply date is not after due date
  const supplyDate = moment(data.supplyDate as string);
  const dueDate = moment(data.dueDate as string);
  return supplyDate.isSameOrBefore(dueDate);
}, {
  message: "Supply date cannot be after due date",
  path: ["supplyDate"],
}).refine((data) => {
  // Validate that supply date is not before request date
  const requestDate = moment(data.requestDate as string);
  const supplyDate = moment(data.supplyDate as string);
  return supplyDate.isSameOrAfter(requestDate);
}, {
  message: "Supply date cannot be before request date",
  path: ["supplyDate"],
});

// Payment request form schema with enhanced validation
const paymentRequestSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  requestDate: z.string().min(1, "Request date is required"),
  supplyDate: z.string().min(1, "Supply date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  allowPartialPayments: z.string().min(1, "Please select partial payment option"),
  amount: z.string().min(1, "Amount is required").refine((val) => {
    const numVal = parseFloat(val.replace(/,/g, ''));
    return !isNaN(numVal) && numVal > 0;
  }, "Amount must be a valid positive number"),
  currency: z.string().min(1, "Currency is required"),
  referenceNumber: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
}).refine((data) => {
  // Validate that request date is not in the past
  const requestDate = moment(data.requestDate as string);
  const today = moment().startOf('day');
  return requestDate.isSameOrAfter(today);
}, {
  message: "Request date cannot be in the past",
  path: ["requestDate"],
}).refine((data) => {
  // Validate that due date is not before request date
  const requestDate = moment(data.requestDate as string);
  const dueDate = moment(data.dueDate as string);
  return dueDate.isSameOrAfter(requestDate);
}, {
  message: "Due date cannot be before request date",
  path: ["dueDate"],
}).refine((data) => {
  // Validate that supply date is not after due date
  const supplyDate = moment(data.supplyDate as string);
  const dueDate = moment(data.dueDate as string);
  return supplyDate.isSameOrBefore(dueDate);
}, {
  message: "Supply date cannot be after due date",
  path: ["supplyDate"],
}).refine((data) => {
  // Validate that supply date is not before request date
  const requestDate = moment(data.requestDate as string);
  const supplyDate = moment(data.supplyDate as string);
  return supplyDate.isSameOrAfter(requestDate);
}, {
  message: "Supply date cannot be before request date",
  path: ["supplyDate"],
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
type PaymentRequestFormValues = z.infer<typeof paymentRequestSchema>;

const mockItems = [
  { name: "", unit_price: 0, quantity: 0, amount: 0, tax_amount: 0, totalAmount: 0, tax_rate: 1 },
];

export type FormMode = 'create' | 'update';

interface PaymentRequestData {
  id: string;
  request_date: string;
  supply_date: string;
  due_date: string;
  partial_payments: boolean;
  currency: string;
  reference_number?: string;
  description?: string;
  payment_request_tax: string;
  terms?: string;
  note?: string;
  amount: number;
  items?: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    amount: number;
    tax_amount: number;
    totalAmount: number;
    id?: number;
  }>;
}

interface UnifiedPaymentFormProps {
  type: PaymentRequestType;
  mode?: FormMode;
  back?: () => void;
  setPaymentReqId?: (paymentReqId: number) => void;
  customer?: Business;
  existingData?: PaymentRequestData;
  onUpdateSuccess?: () => void;
}
// Get current date in YYYY-MM-DD format
const getCurrentDate = () => moment().format('YYYY-MM-DD');

// Calculate due date based on request date and business payment terms
const getDueDate = (requestDate: string, paymentTerms: number = 30) => {
  return moment(requestDate).add(paymentTerms, 'days').format('YYYY-MM-DD');
};

// Calculate supply date based on request date (default to same day)
const getSupplyDate = (requestDate: string) => {
  return moment(requestDate).format('YYYY-MM-DD');
};

export default function UnifiedPaymentForm({
  type,
  mode = 'create',
  back,
  setPaymentReqId,
  customer,
  existingData,
  onUpdateSuccess
}: UnifiedPaymentFormProps) {
  const { currentBusiness, user } = useApp();
  const { mutateAsync: createPaymentRequest, isPending: isCreating } = useCreatePaymentRequest();
  const { mutateAsync: updatePaymentRequest, isPending: isUpdating } = useUpdatePaymentRequest();
  const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadAttachment();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem();

  const isPending = isCreating || isUpdating;

  // Check if current business can send invoices
  const canSendPayments = canSendInvoices(currentBusiness);

  // If this is a creation mode and business cannot send invoices, show restriction message
  if (mode === 'create' && !canSendPayments) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Feature Not Available</h3>
        <p className="text-yellow-700 mb-4">{getPersonalBusinessRestrictionsMessage()}</p>
        <button 
          onClick={() => window.history.back()} 
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Get business payment terms and partial payment settings
  const businessPaymentTerms = currentBusiness?.payment_terms || 30;
  const businessPartialPayments = currentBusiness?.partial_payments || false;

  // Invoice form setup with current date defaults
  const invoiceForm = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema) as Resolver<InvoiceFormValues>,
    defaultValues: {
      requestDate: getCurrentDate(),
      supplyDate: getCurrentDate(),
      dueDate: getDueDate(getCurrentDate(), businessPaymentTerms),
      items: mockItems,
      roundTotalAmount: true,
      currency: 'GBP',
      allowPartialPayments: businessPartialPayments ? 'Yes' : 'No',
      amountsAre: "Tax exclusive",
      referenceNumber: '',
      termsAndConditions: '',
      note: '',
      description: '',
    },
  });

  // Payment request form setup with current date defaults
  const paymentRequestForm = useForm<PaymentRequestFormValues>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      documentType: "Payment request",
      requestDate: getCurrentDate(),
      supplyDate: getCurrentDate(),
      dueDate: getDueDate(getCurrentDate(), businessPaymentTerms),
      allowPartialPayments: businessPartialPayments ? 'Yes' : 'No',
      currency: "GBP",
      amount: "",
      referenceNumber: '',
      description: '',
    }
  });
  console.log(invoiceForm.formState.errors);
  // Populate form with existing data when in update mode
  useEffect(() => {
    if (mode === 'update' && existingData) {
      if (type === PaymentRequestType.INVOICE) {
        invoiceForm.reset({
          requestDate: moment(existingData.request_date).format('YYYY-MM-DD'),
          supplyDate: moment(existingData.supply_date).format('YYYY-MM-DD'),
          dueDate: moment(existingData.due_date).format('YYYY-MM-DD'),
          allowPartialPayments: existingData.partial_payments ? "Yes" : "No",
          currency: existingData.currency,
          referenceNumber: existingData.reference_number || "",
          amountsAre: existingData.payment_request_tax, // Default value, you might want to get this from existingData
          termsAndConditions: existingData.terms || "",
          note: existingData.note || "",
          description: existingData.description || "",
          items: existingData.items && existingData.items.length > 0 ? existingData.items : mockItems,
          roundTotalAmount: false,
          amount: existingData.amount
        });
      } else {
        paymentRequestForm.reset({
          documentType: "Payment request",
          requestDate: moment(existingData.request_date).format('YYYY-MM-DD'),
          supplyDate: moment(existingData.supply_date).format('YYYY-MM-DD'),
          dueDate: moment(existingData.due_date).format('YYYY-MM-DD'),
          allowPartialPayments: existingData.partial_payments ? "Yes" : "No",
          amount: existingData.amount.toString(),
          currency: existingData.currency,
          referenceNumber: existingData.reference_number || "",
          description: existingData.description || "",
        });
      }
    } else if (mode === 'create') {
      // Reset forms to business-based defaults when in create mode
      if (type === PaymentRequestType.INVOICE) {
        invoiceForm.reset({
          requestDate: getCurrentDate(),
          supplyDate: getCurrentDate(),
          dueDate: getDueDate(getCurrentDate(), businessPaymentTerms),
          items: mockItems,
          roundTotalAmount: true,
          currency: 'GBP',
          allowPartialPayments: businessPartialPayments ? 'Yes' : 'No',
          amountsAre: "Tax exclusive",
          referenceNumber: '',
          termsAndConditions: '',
          note: '',
          description: '',
        });
      } else {
        paymentRequestForm.reset({
          documentType: "Payment request",
          requestDate: getCurrentDate(),
          supplyDate: getCurrentDate(),
          dueDate: getDueDate(getCurrentDate(), businessPaymentTerms),
          allowPartialPayments: businessPartialPayments ? 'Yes' : 'No',
          currency: "GBP",
          amount: "",
          referenceNumber: '',
          description: '',
        });
      }
    }
  }, [mode, existingData, type, invoiceForm, paymentRequestForm, businessPaymentTerms, businessPartialPayments]);

  // Invoice-specific calculations
  const calculateItemTotals = (index: number) => {
    if (type !== PaymentRequestType.INVOICE) return;

    const price = invoiceForm.watch(`items.${index}.unit_price`) || 0;
    const quantity = invoiceForm.watch(`items.${index}.quantity`) || 0;
    const taxRate = invoiceForm.watch(`items.${index}.tax_rate`) || 1;
    const amountsAre = invoiceForm.watch('amountsAre') || 'Tax exclusive';

    const amount = price * quantity;
    let taxAmount = 0;
    let totalAmount = amount;

    if (taxRate > 1) {
      if (amountsAre === 'Tax exclusive') {
        // Tax exclusive: price doesn't include tax, so we add tax
        taxAmount = amount * (taxRate - 1);
        totalAmount = amount + taxAmount;
      } else if (amountsAre === 'Tax inclusive') {
        // Tax inclusive: price includes tax, so we extract tax
        taxAmount = amount - (amount / taxRate);
        totalAmount = amount; // Total remains the same as the price already includes tax
      } else {
        // No tax
        taxAmount = 0;
        totalAmount = amount;
      }
    }

    invoiceForm.setValue(`items.${index}.amount`, amount);
    invoiceForm.setValue(`items.${index}.tax_amount`, taxAmount);
    invoiceForm.setValue(`items.${index}.totalAmount`, totalAmount);
  };

  const subTotal = type === PaymentRequestType.INVOICE ? invoiceForm.watch('items').reduce((acc: number, item: any) => acc + (item?.amount || 0), 0) : 0;
  const vat = type === PaymentRequestType.INVOICE ? invoiceForm.watch('items').reduce((acc: number, item: any) => acc + (item?.tax_amount || 0), 0) : 0;
  const totalBeforeRounding = subTotal + vat;

  // Calculate rounded total and rounding amount
  const roundTotalAmount = type === PaymentRequestType.INVOICE ? invoiceForm.watch('roundTotalAmount') : false;
  const total = roundTotalAmount ? Math.round(totalBeforeRounding) : totalBeforeRounding;
  const roundingAmount = total - totalBeforeRounding;

  const handleItemChange = useCallback((index: number) => {
    if (type !== PaymentRequestType.INVOICE) return;

    calculateItemTotals(index);
    const amount = invoiceForm.watch(`items.${index}.amount`);
    const tax_amount = invoiceForm.watch(`items.${index}.tax_amount`);
    const totalAmount = invoiceForm.watch(`items.${index}.totalAmount`);

    invoiceForm.setValue(`items.${index}.amount`, amount, { shouldValidate: true });
    invoiceForm.setValue(`items.${index}.tax_amount`, tax_amount, { shouldValidate: true });
    invoiceForm.setValue(`items.${index}.totalAmount`, totalAmount, { shouldValidate: true });
  }, [type, invoiceForm]);

  // Watch for amountsAre changes to recalculate all items
  const amountsAre = invoiceForm.watch('amountsAre');
  useEffect(() => {
    if (type === PaymentRequestType.INVOICE) {
      const items = invoiceForm.watch('items');
      items.forEach((_, index) => {
        calculateItemTotals(index);
      });
    }
  }, [amountsAre, type]);

  // Watch for request date changes to update due date and supply date
  const requestDate = type === PaymentRequestType.INVOICE
    ? invoiceForm.watch('requestDate')
    : paymentRequestForm.watch('requestDate');

  useEffect(() => {
    if (requestDate) {
      const newDueDate = getDueDate(requestDate, businessPaymentTerms);
      const newSupplyDate = getSupplyDate(requestDate);

      if (type === PaymentRequestType.INVOICE) {
        invoiceForm.setValue('dueDate', newDueDate);
        invoiceForm.setValue('supplyDate', newSupplyDate);
      } else {
        paymentRequestForm.setValue('dueDate', newDueDate);
        paymentRequestForm.setValue('supplyDate', newSupplyDate);
      }
    }
  }, [requestDate, businessPaymentTerms, type, invoiceForm, paymentRequestForm]);

  const handleRowClick = () => {
    if (type !== PaymentRequestType.INVOICE) return;

    const items = invoiceForm.watch('items');
    items.push({ name: "", unit_price: 0, quantity: 0, amount: 0, tax_amount: 0, totalAmount: 0, tax_rate: 1 });
    invoiceForm.setValue('items', items);
    invoiceForm.setValue('amount', total);
  };

  const handleRowDelete = async (id: number) => {
    const res = await deleteItem(id);
    if (type !== PaymentRequestType.INVOICE) return;
    const items = invoiceForm.watch('items');
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
    }
    invoiceForm.setValue('items', items);
  };

  // Payment request amount formatting
  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    const wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${wholeNumber}.${parts[1]}` : wholeNumber;
  };

  const [attachments, setAttachments] = useState<File[]>([]);

  // Submit handlers
  const onSubmitInvoice: SubmitHandler<InvoiceFormValues> = async (paymentReq) => {
    if (mode === 'update' && existingData) {
      // Update existing invoice
      const updates = {
        request_date: moment(paymentReq.requestDate).format('YYYY-MM-DD'),
        supply_date: moment(paymentReq.supplyDate).format('YYYY-MM-DD'),
        due_date: moment(paymentReq.dueDate).format('YYYY-MM-DD'),
        partial_payments: paymentReq.allowPartialPayments === "Yes",
        currency: paymentReq.currency,
        reference_number: paymentReq.referenceNumber,
        payment_request_tax: paymentReq.amountsAre,
        terms: paymentReq.termsAndConditions,
        items: paymentReq.items,
        note: paymentReq.note,
        description: paymentReq.description,
        amount: total,
      };

      const res = await updatePaymentRequest({
        paymentRequestId: Number(existingData.id),
        updates,
      });

      if (res.status === "success") {
        back?.();
      }
    } else {
      // Create new invoice
      const invoiceData: any = {
        paymentReq: {
          request_date: moment(paymentReq.requestDate).format('YYYY-MM-DD'),
          supply_date: moment(paymentReq.supplyDate).format('YYYY-MM-DD'),
          due_date: moment(paymentReq.dueDate).format('YYYY-MM-DD'),
          partial_payments: paymentReq.allowPartialPayments === "Yes",
          currency: "GBP",
          reference_number: paymentReq.referenceNumber,
          document_type: "Invoice",
          payment_request_tax: paymentReq.amountsAre,
          terms: paymentReq.termsAndConditions,
          note: paymentReq.note,
          description: paymentReq.description,
          customer_id: Number(customer?.id),
          created_by: user?.id || "",
          customer_owner_id: currentBusiness?.ownerId,
          amount: total,
          items: paymentReq.items,
          remainder: 0
        },
        businessId: currentBusiness?.id,
        isToPay: null,
      };
      if (attachments.length > 0) {
        const folder = Date.now().toString();
        const res = await uploadAttachment({
          files: attachments,
          folder,
          bucket: "attachments",
        });
        if (res) {
          invoiceData.paymentReq.attachments = res;
        }
      }
      const res2 = await createPaymentRequest(invoiceData as any);
      if (res2.status === "success" && setPaymentReqId) {
        setPaymentReqId(res2.data.reqId);
      }
    }
  }

  const onSubmitPaymentRequest: SubmitHandler<PaymentRequestFormValues> = async (data) => {
    if (mode === 'update' && existingData) {
      // Update existing payment request
      const updates = {
        request_date: moment(data.requestDate).format('YYYY-MM-DD'),
        supply_date: moment(data.supplyDate).format('YYYY-MM-DD'),
        due_date: moment(data.dueDate).format('YYYY-MM-DD'),
        partial_payments: data.allowPartialPayments === "Yes",
        currency: data.currency,
        reference_number: data.referenceNumber,
        description: data.description,
        amount: +data.amount.replaceAll(/,/g, ""),
      };

      const res = await updatePaymentRequest({
        paymentRequestId: Number(existingData.id),
        updates,
      });

      if (res.status === "success") {
        back?.();
      }
    } else {
      // Create new payment request
      const paymentReq: any = {
        vendor_owner_id: currentBusiness?.ownerId || "",
        customer_id: Number(customer?.id) || 0,
        customer_owner_id: customer?.ownerId || "",
        amount: +data.amount.replaceAll(/,/g, ""),
        currency: data.currency,
        due_date: new Date(data.dueDate),
        document_type: "Payment request",
        reference_number: data.referenceNumber || "",
        supply_date: new Date(data.supplyDate),
        request_date: new Date(data.requestDate),
        created_by: user?.id || "",
        partial_payments: data.allowPartialPayments === "Yes" ? "Yes" : "No",
        description: data.description,
      };
      if (attachments.length > 0) {
        const folder = Date.now().toString();
        const res = await uploadAttachment({
          files: attachments,
          folder,
          bucket: "attachments",
        });
        if (res) {
          paymentReq.attachments = res;
        }
      }
      const response = await createPaymentRequest({
        paymentReq,
        businessId: currentBusiness?.id || 0,
      });
      if (response.status === "success" && setPaymentReqId) {
        setPaymentReqId(response.data.reqId);
      }
    };
  }

  if (type === PaymentRequestType.INVOICE) {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = invoiceForm;

    return (
      <form onSubmit={handleSubmit(onSubmitInvoice)} className="bg-white rounded-2xl p-8 shadow-lg max-w-6xl mx-auto flex flex-col gap-4 w-full">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <DateInput
            label="Create Date"
            disabled
            {...register("requestDate")}
            error={errors.requestDate?.message}
          />
          <DateInput
            label="Supply Date"
            {...register("supplyDate")}
            error={errors.supplyDate?.message}
          />
          <DateInput
            label="Due Date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
          <Select
            label="Partial Payments"
            options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
            {...register("allowPartialPayments")}
            error={errors.allowPartialPayments?.message}
          />
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <Select
            label="Currency"
            options={[{ label: 'GBP', value: 'GBP' }]}
            {...register("currency")}
            error={errors.currency?.message}
            defaultValue={'GBP'}
          />
          <Input
            label="Reference"
            type="text"
            {...register("referenceNumber")}
            error={errors.referenceNumber?.message}
            placeholder="Enter reference"
          />
          <Select
            label="Amounts Are"
            options={[{ label: 'Tax exclusive', value: 'Tax exclusive' }, { label: 'Tax inclusive', value: 'Tax inclusive' }, { label: 'No tax', value: 'No tax' }]}
            {...register("amountsAre")}
            error={errors.amountsAre?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input
            label="Terms & Conditions"
            type="text"
            {...register("termsAndConditions")}
            error={errors.termsAndConditions?.message}
            placeholder="Enter terms and conditions"
          />
          <Input
            label="Note"
            type="text"
            {...register("note")}
            error={errors.note?.message}
            placeholder="Enter note"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Input
            label="Description"
            type="text"
            {...register("description")}
            error={errors.description?.message}
            placeholder="Enter description"
          />
        </div>

        {/* Invoice Table */}
        <div className="flex-1">
          <div className={`overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col gap-4`}>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Item Name*</th>
                  <th className="px-4 py-3">Qty*</th>
                  <th className="px-4 py-3">Price*</th>
                  <th className="px-4 py-3">Tax*</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Tax Amount</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {watch("items").map((item, index) => (
                  <tr key={index} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-2">
                      <Input
                        {...register(`items.${index}.name`, {
                          onChange: (e) => handleItemChange(index),
                        })}
                        error={errors.items?.[index]?.name?.message}
                        className="min-w-[100px]"
                        placeholder="Item name"
                      />

                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="text"
                        {...register(`items.${index}.quantity`, {
                          onChange: (e) => {
                            // Only allow numeric input with exactly 2 decimal places
                            let value = e.target.value.replace(/[^\d.,]/g, '');

                            // Replace comma with period for decimal
                            value = value.replace(',', '.');

                            // Ensure only one decimal point
                            const parts = value.split('.');
                            if (parts.length > 2) {
                              value = parts[0] + '.' + parts.slice(1).join('');
                            }

                            // Enforce exactly 2 decimal places
                            if (parts.length === 2) {
                              value = parts[0] + '.' + parts[1].substring(0, 2);
                            } else if (parts.length === 1 && value.includes('.')) {
                              value = parts[0] + '.00';
                            }

                            // Add thousand separators (periods)
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              const formattedValue = numValue.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).replace(/,/g, '.');
                              e.target.value = formattedValue;

                              // Set the numeric value for form validation
                              invoiceForm.setValue(`items.${index}.quantity`, numValue, { shouldValidate: true });
                              handleItemChange(index);
                            } else if (value === '' || value === '0') {
                              e.target.value = '';
                              invoiceForm.setValue(`items.${index}.quantity`, 0, { shouldValidate: true });
                              handleItemChange(index);
                            }
                          },
                          onBlur: (e) => {
                            const value = parseFloat(e.target.value.replace(/\./g, ''));
                            if (isNaN(value) || value <= 0) {
                              e.target.value = '';
                              invoiceForm.setValue(`items.${index}.quantity`, 0, { shouldValidate: true });
                              handleItemChange(index);
                            }
                          }
                        })}
                        className='min-w-[70px]'
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="text"
                        {...register(`items.${index}.unit_price`, {
                          onChange: (e) => {
                            // Only allow numeric input with exactly 2 decimal places
                            let value = e.target.value.replace(/[^\d.,]/g, '');

                            // Replace comma with period for decimal
                            value = value.replace(',', '.');

                            // Ensure only one decimal point
                            const parts = value.split('.');
                            if (parts.length > 2) {
                              value = parts[0] + '.' + parts.slice(1).join('');
                            }

                            // Enforce exactly 2 decimal places
                            if (parts.length === 2) {
                              value = parts[0] + '.' + parts[1].substring(0, 2);
                            } else if (parts.length === 1 && value.includes('.')) {
                              value = parts[0] + '.00';
                            }

                            // Add thousand separators (periods)
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              const formattedValue = numValue.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).replace(/,/g, '.');
                              e.target.value = formattedValue;

                              // Set the numeric value for form validation
                              invoiceForm.setValue(`items.${index}.unit_price`, numValue, { shouldValidate: true });
                              handleItemChange(index);
                            } else if (value === '' || value === '0') {
                              e.target.value = '';
                              invoiceForm.setValue(`items.${index}.unit_price`, 0, { shouldValidate: true });
                              handleItemChange(index);
                            }
                          },
                          onBlur: (e) => {
                            const value = parseFloat(e.target.value.replace(/\./g, ''));
                            if (isNaN(value) || value <= 0) {
                              e.target.value = '';
                              invoiceForm.setValue(`items.${index}.unit_price`, 0, { shouldValidate: true });
                              handleItemChange(index);
                            }
                          }
                        })}
                        className='min-w-[80px]'
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        options={[
                          { label: 'No VAT', value: '1' },
                          { label: '5%', value: '1.05' },
                          { label: '20%', value: '1.2' }
                        ]}
                        defaultValue={'1'}
                        className='min-w-[100px]'
                        error={errors.items?.[index]?.tax_rate?.message}
                        {...register(`items.${index}.tax_rate`, {
                          valueAsNumber: true, onChange: (e) => {
                            handleItemChange(index);
                          }
                        })}
                      />
                    </td>
                    <td className="px-4 py-2">£{item.amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2">£{item.tax_amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2">£{item.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRowDelete((item as any).id)}
                          className="p-1.5 rounded-full hover:bg-red-100 text-red-600"
                          disabled={watch("items").length === 1}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleRowClick}
                className="flex items-center gap-2"
                disabled={watch("items").length >= 100}
              >
                <PlusIcon className="w-4 h-4" /> Add Item
              </Button>
            </div>
          </div>
        </div>
        {/* Totals Section */}
        <div className="flex flex-col items-end gap-3 p-4 border-t">
          <div className="flex justify-between w-64 text-gray-600">
            <span>Subtotal:</span>
            <span className="font-medium">£{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-64 text-gray-600">
            <span>VAT:</span>
            <span className="font-medium">£{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-64 text-gray-600">
            <span>Total before rounding:</span>
            <span className="font-medium">£{formatAmount(totalBeforeRounding.toFixed(2))}</span>
          </div>
          {roundTotalAmount && roundingAmount !== 0 && (
            <div className="flex justify-between w-64 text-gray-600">
              <span>Rounding:</span>
              <span className={`font-medium ${roundingAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{formatAmount(roundingAmount.toFixed(2))}
              </span>
            </div>
          )}
          <div className="flex justify-between w-64 text-gray-600 items-center">
            <Checkbox
              label="Round Total Amount"
              checked={watch('roundTotalAmount')}
              onChange={(checked) => setValue('roundTotalAmount', checked)}
            />
          </div>
          <div className="flex justify-between w-64 text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>£{formatAmount(total.toFixed(2))}</span>
          </div>
        </div>

        {/* Attachment Field */}
        <AttachmentField attachments={attachments} setAttachments={setAttachments} />

        {/* Submit */}
        <div className="flex justify-end mt-6 gap-2">
          {mode === 'update' && (
            <Button
              type="button"
              variant="outline"
              colorSchema="gray"
              isLoading={false}
              onClick={() => back?.()}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            colorSchema="green"
            className="px-6 py-3 text-white font-semibold rounded-xl shadow hover:shadow-md"
            isLoading={isPending}
          >
            {isPending ? (mode === 'update' ? "Updating..." : "Creating...") : (mode === 'update' ? "Update Invoice" : "Create Invoice")}
          </Button>
        </div>
      </form >
    );
  }

  // Payment Request Form
  const { register, handleSubmit, formState: { errors } } = paymentRequestForm;

  return (
    <form onSubmit={handleSubmit(onSubmitPaymentRequest)} className="p-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DateInput
          label="Create Date"
          disabled
          {...register("requestDate")}
          error={errors.requestDate?.message}
        />
        <DateInput
          label="Supply Date"
          {...register("supplyDate")}
          error={errors.supplyDate?.message}
        />
        <DateInput
          label="Due Date"
          {...register("dueDate")}
          error={errors.dueDate?.message}
        />
        <Select
          label="Partial Payments"
          options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
          {...register("allowPartialPayments")}
          error={errors.allowPartialPayments?.message}
        />
      </div>
      {/* Amount and Currency Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Input
          label="Amount"
          type="text"
          {...register("amount", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = formatAmount(e.target.value)
            }
          })}
          error={errors.amount?.message}
          placeholder="Enter amount"
        />
        <Select
          label="Currency"
          options={[{ label: 'GBP', value: 'GBP' }]}
          {...register("currency")}
          error={errors.currency?.message}
          defaultValue={'GBP'}
        />
        <Input
          label="Reference"
          type="text"
          {...register("referenceNumber")}
          error={errors.referenceNumber?.message}
          placeholder="Enter reference"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Input
          label="Description"
          type="text"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Enter description"
        />
      </div>
      {/* Attachment Field */}
      <AttachmentField attachments={attachments} setAttachments={setAttachments} />

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        {mode === 'update' && (
          <Button
            type="button"
            variant="outline"
            colorSchema="gray"
            isLoading={false}
            onClick={() => back?.()}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          colorSchema="green"
          isLoading={false}
        >
          {isPending ? (mode === 'update' ? "Updating..." : "Creating...") : (mode === 'update' ? "Update Payment Request" : "Create a new payment request")}
        </Button>
      </div>
    </form>
  );
}       