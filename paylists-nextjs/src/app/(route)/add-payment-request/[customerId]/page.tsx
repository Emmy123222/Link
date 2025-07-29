"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IoMdArrowBack } from "react-icons/io"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useBusinessById } from "@/hooks/use-businesses"
import PaymentConfirmModal from "@/components/ui/PaymentConfirmModal"
import { useSendPaymentRequestEmail } from "@/hooks/use-payment"
import UnifiedPaymentForm from "@/form/UnifiedPaymentForm"
import { Card, CardContent } from "@/components/ui/card"
import { Business } from "@/types/business"

export default function AddPaymentRequestPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { mutateAsync: sendPaymentRequestEmail } = useSendPaymentRequestEmail()
  const customerId = params.customerId as string
  const { data: customer } = useBusinessById(customerId)
  const [documentType, setDocumentType] = useState("Payment request")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get("type")) {
      setDocumentType(searchParams.get("type") as string)
    }
  }, [searchParams])
  const [paymentRequest, setPaymentRequest] = useState(0)
  const router = useRouter()
  const handlePaymentReqId = (paymentSend: number) => {
    setIsModalOpen(true)
    setPaymentRequest(paymentSend)
  }

  const handleSaveDraft = () => {
    setIsModalOpen(false)
    router.push(`/payments-in/${paymentRequest}`)
  }

  const handleSend = async () => {
    const data = await sendPaymentRequestEmail({ reqId: paymentRequest })
    if (data.status === "success") {
      router.push(`/payments-in/${paymentRequest}`)
    }
  }

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Link
          href="/payments-in"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <IoMdArrowBack className="mr-2 h-4 w-4" />
          <span>Back</span>
        </Link>
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
            <div className="space-y-2 grid grid-cols-2 items-center justify-between">
              <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
                <span className="text-gray-600  whitespace-nowrap">Name:</span>
                <span className="text-gray-900 font-medium break-words">{(customer as any)?.business_name}</span>
              </div>
              <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
                <span className="text-gray-600 whitespace-nowrap">Email:</span>
                <span className="text-gray-900 break-all">{(customer as any)?.email}</span>
              </div>
              <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
                <span className="text-gray-600 whitespace-nowrap">Contact Person:</span>
                <span className="text-gray-900 break-all">{(customer as any)?.name}</span>
              </div>
              <div className="flex xs:flex-row xs:items-center text-sm gap-1 xs:gap-2">
                <span className="text-gray-600 whitespace-nowrap">Phone:</span>
                <span className="text-gray-900 break-words">{(customer as any)?.mobile_phone_number}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="bg-white rounded-lg shadow-sm">

          <UnifiedPaymentForm
            type={documentType as any}
            mode="create"
            setPaymentReqId={handlePaymentReqId}
            customer={customer as unknown as Business}
          />
        </div>
      </div>
      <PaymentConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveDraft={handleSaveDraft}
        onSend={handleSend}
      />
    </div>
  )
} 