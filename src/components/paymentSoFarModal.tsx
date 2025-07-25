// "use client"

// import { IoClose } from "react-icons/io5";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
// import { useParams } from "next/navigation"
// import { useCancelTransaction, useTransactions } from "@/hooks/use-payment"
// import { TransactionSummaryType, TransactionSummaryStatus } from "@/types/payments";
// import { useEffect, useState } from "react";
// import { formatCurrency, formatDate } from "@/utils/utils";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function PaymentSoFarModal({ isOpen, onClose, }: Props) {

//   const { paymentReqId } = useParams()
//   const { data: transactionsData, refetch } = useTransactions(paymentReqId as string)
//   const { mutate: cancelTransaction, isPending: isCancelling } = useCancelTransaction()

//   const [transactions, setTransactions] = useState<any[]>([])

//   useEffect(() => {
//     refetch()
//   }, [isOpen])

//   useEffect(() => {
//     setTransactions(transactionsData || [])
//   }, [transactionsData])

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 animate-fade-in">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Payment So Far</h2>
//           <Button onClick={onClose} colorSchema="white" variant="outline" aria-label="Close" className="p-1">
//             <IoClose size={15} />
//           </Button>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm max-w-4xl overflow-y-auto max-h-[500px]">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Created on</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Date of Payment</TableHead>
//                 <TableHead>Method</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {transactions.map((transaction) => (
//                 <TableRow key={transaction.id}>
//                   <TableCell>{transaction.status}</TableCell>
//                   <TableCell>{formatDate(transaction.created_at)}</TableCell>
//                   <TableCell>{formatCurrency(transaction.amount)}</TableCell>
//                   <TableCell>{transaction.type}</TableCell>
//                   <TableCell>{formatDate(transaction.paymentDate)}</TableCell>
//                   <TableCell>{transaction.method}</TableCell>
//                   <TableCell>{transaction.description}</TableCell>
//                   {/* Cancel button for manual payment or credit note */}
//                   {(transaction.type === TransactionSummaryType.MANUAL_PAYMENT || transaction.type === TransactionSummaryType.CREDIT_NOTE) && transaction.status !== TransactionSummaryStatus.CANCELLED && (
//                     <TableCell>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           cancelTransaction({ transactionId: transaction.id, amount: transaction.amount, paymentReqId: paymentReqId as string })
//                           setTransactions(transactions.filter((t) => t.id !== transaction.id))
//                         }}
//                         disabled={isCancelling}
//                       >
//                         Cancel
//                       </Button>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div >
//   )
// }
