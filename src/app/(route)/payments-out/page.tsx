"use client"

import { useEffect, useState } from "react"
import { Download, Plus } from "lucide-react"
import Link from "next/link"
import { FiFilter } from "react-icons/fi"
import { FilterCollapse } from "@/components/filterCollapse"
import { useApp } from "@/providers/AppProvider"
import { usePaymentsIn, usePaymentsOut } from "@/hooks/use-payment"
import { Button } from "@/components/ui/button"
import { TableColumn, TableList } from "@/components/TableList"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useDeletePaymentRequest } from "@/hooks/use-payment"
import { cn } from "@/lib/utils"
import { CollectionStatusCard } from "@/components/CollectionStatusCard"
import { PaymentsCard } from "@/components/PaymentsCard"
import { formatCurrency } from "@/utils/utils"
import moment from "moment"

export default function PaymentsInPage() {
  const router = useRouter()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { currentBusiness } = useApp();
  const [lists, setLists] = useState<any[]>([])
  const { data: paymentsIn } = usePaymentsOut(currentBusiness?.id || "")
  const { mutateAsync: deletePaymentIn } = useDeletePaymentRequest()

  useEffect(() => {
    if (paymentsIn) {
      setLists(paymentsIn)
    }
  }, [paymentsIn])

  const tableColumns: TableColumn<any>[] = [
    {
      label: "Status", accessor: "status", render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className={cn(" w-6 h-6 flex items-center justify-center rounded-full m-auto", row.status === "Draft" ? "bg-yellow-500 text-white" : "bg-green-500 text-white")} />
          <span>{row.status}</span>
        </div>
      )
    },
    {
      label: "Payment done",
      accessor: "payment_done",
      render: (row: any) => (
        <div className={cn(" w-6 h-6 flex items-center justify-center rounded-full m-auto", row.payment_done ? "bg-green-500 text-white" : "bg-red-500 text-white w-0 h-0")} />
      )
    },
    {
      label: "Document number", accessor: "document_number", render: (row: any) => (
        <span>{row.document_number}</span>
      )
    },
    {
      label: "Customer", accessor: "customer.business_name", render: (row: any) => (
        row?.customer?.id ? (
          <Link href={`/customers/${row?.customer?.id}`} className="text-blue-500 hover:text-blue-700">
            {row.customer.business_name}
          </Link>
        ) : (
          <span className="text-gray-500">No customer</span>
        )
      )
    },
    { label: "Description", accessor: "description", colSpan: 2 },
    {
      label: "Amount",
      accessor: "amount",
      render: (row: any) => (
        <span>{formatCurrency(row.amount || 0)}</span>
      )
    },
    {
      label: "Creation Date", accessor: "request_date", render: (row: any) => (
        <span>{moment(row.request_date).format("DD/MM/YYYY")}</span>
      ),
      className: "text-right"
    },
    {
      label: "Remaining",
      accessor: "remainder",
      render: (row: any) => {
        const remaining = (row.amount || 0) - (row.paid_amount || 0);
        return (
          <Badge variant="outline" color={remaining === 0 ? "success" : "error"}>
            {formatCurrency(remaining)}
          </Badge>
        );
      }
    },
    {
      label: "Due date", accessor: "due_date"
    },
    {
      label: "Last updated", accessor: "updated_at"
    },
    {
      label: "Actions", accessor: "actions", render: (row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-green-600" onClick={() => router.push(`/payments-in/${row.id}`)}>
            <FaEdit />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" onClick={async () => {
            const res = await deletePaymentIn(row.id)
            if (res.status === "success") {
              setLists(lists.filter((list) => list.id !== row.id))
            }
          }}>
            <FaTrash />
          </Button>
        </div>
      )
    }
  ]

  const collectionTotal = lists.length;
  const collectionPaid = lists.filter((p) => p.payment_done).length;
  const collectionPercent = collectionTotal ? Math.round((collectionPaid / collectionTotal) * 100) : 0;
  const paymentsDone = lists.filter((p) => p.payment_done);

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-hidden max-w-[100vw] sm:max-w-[90vw]">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
        {/* Left column */}
        <div className="hidden lg:block lg:w-1/5 space-y-4 sm:space-y-6">
          {/* Collection status card */}
          <CollectionStatusCard title="Collection Successful" percentage={collectionPercent} color="text-green-600" />
          {/* Payments card */}
          <PaymentsCard title="Payments" payments={paymentsDone} />
        </div>

        {/* Right column - Table */}
        <div className="w-full lg:w-4/5 h-full">
          {/* Table header with actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <Link
              href="/add-payment-request"
              className="w-full sm:col-span-2 lg:col-span-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus size={18} />
              <span>Create a request</span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2 lg:col-span-2 justify-end">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Download size={20} />
              </button>
              <button
                className="flex items-center justify-center gap-1 py-2 px-4 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                onClick={() => setIsFilterOpen(true)}
              >
                <FiFilter size={18} />
                <span>FILTER ACTIVE</span>
              </button>
            </div>
          </div>
          <FilterCollapse isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

          {/* Table wrapper for horizontal scroll */}
          <div className="bg-white rounded-lg shadow-sm">
            <TableList data={lists || []} columns={tableColumns} />
          </div>
        </div>
      </div>
    </main>
  )
}
