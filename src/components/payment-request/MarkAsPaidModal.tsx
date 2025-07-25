// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
// import { addPaymentSchema, type AddPaymentFormData } from '@/lib/validations/payment-request';
// import { IoClose } from 'react-icons/io5';

// const MarkAsPaidModal = ({
//   open,
//   onClose,
//   onAdd,
//   remaining = 0,
//   type,
//   title
// }: {
//   open: boolean;
//   onClose: () => void;
//   onAdd: (data: AddPaymentFormData) => void;
//   remaining?: number;
//   type: string;
//   title: string;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm<AddPaymentFormData>({
//     resolver: zodResolver(addPaymentSchema),
//     defaultValues: {
//       paymentType: type,
//       paymentMethod: type === 'Add Credit note' ? 'Credit note' : '',
//       amount: remaining,
//       date: new Date().toISOString().split('T')[0],
//       description: '',
//     },
//   });

//   const paymentType = watch('paymentType');

//   useEffect(() => {
//     reset({
//       paymentType: type,
//       paymentMethod: type === 'Add Credit note' ? 'Credit note' : '',
//       amount: remaining,
//       date: new Date().toISOString().split('T')[0],
//       description: '',
//     });
//   }, [open, remaining, reset, type]);

//   // Auto-select "Credit note" when payment type changes to "Add Credit note"
//   useEffect(() => {
//     if (paymentType === 'Add Credit note') {
//       setValue('paymentMethod', 'Credit note');
//     }
//   }, [paymentType, setValue]);

//   const paymentTypeOptions = ['Add Payment', 'Add Credit note'];
//   const paymentMethodOptions = {
//     'Add Payment': ['Open banking', 'Debit / Credit Card', 'Bank transfer', 'Cash', 'Card'],
//     'Add Credit note': ['Credit note'],
//   };

//   const currentPaymentMethods = paymentMethodOptions[paymentType as keyof typeof paymentMethodOptions] || [];

//   const onSubmit = (data: AddPaymentFormData) => {
//     onAdd(data);
//     onClose();
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
//               <IoClose size={24} />
//             </button>
//           </div>
//           {title === "Mark as paid" && <p className="text-sm text-gray-500">Payment is not fully paid. You may change the amount, add a manual amount or add a credit note.</p>}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
//             {title === "Mark as paid" && (<Select
//               label="Payment type*"
//               {...register('paymentType')}
//               error={errors.paymentType?.message}
//               options={[{ label: "", value: "" }, ...paymentTypeOptions.map((type) => ({ label: type, value: type }))]}
//             />)}

//             <Select
//               label="Payment method*"
//               {...register('paymentMethod')}
//               error={errors.paymentMethod?.message}
//               options={[{ label: "", value: "" }, ...currentPaymentMethods.map((method) => ({ label: method, value: method }))]}
//             />

//             <div>
//               <Input
//                 label="Amount*"
//                 type="number"
//                 {...register('amount', { valueAsNumber: true })}
//                 error={errors.amount?.message}
//                 max={remaining}
//               />
//               <p className="text-xs text-gray-500 mt-1">{remaining.toLocaleString()} remaining</p>
//             </div>

//             <Input
//               label="Date*"
//               type="date"
//               {...register('date')}
//               error={errors.date?.message}
//             />

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                 placeholder="Add a description..."
//                 {...register('description')}
//               />
//               {errors.description && (
//                 <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
//               )}
//             </div>

//             <Button type="submit" variant="primary" colorSchema="green" className="w-full !mt-8">
//               Add
//             </Button>
//           </form>
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes fade-in-scale {
//           from {
//             transform: scale(0.95);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
//         .animate-fade-in-scale {
//           animation: fade-in-scale 0.3s forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarkAsPaidModal; 