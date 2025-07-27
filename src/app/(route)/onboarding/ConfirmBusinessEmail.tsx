"use client"

import { useState } from "react"
import { Radio } from "@/components/radioButton"
import { useOnboarding } from "./layout"
import { useApp } from "@/providers/AppProvider"
import { useBusinessVerifyEmail, useBusinessCreate, useVerifyCodeFromEmail } from "@/hooks/use-businesses"
import { ConfirmSendEmailModal } from "@/components/confirmSendEmailModal"
import { ApiResponse } from "@/lib/utils/api"
import { Business } from "@/types/business"
import VerifyCodeModal from "@/components/VerifyCodeModal"

type Props = {
  next?: () => void;
};

export default function ConfirmBusinessEmail({ next }: Props) {
  const [value, setValue] = useState("yes");
  const { user } = useApp()
  const { business, setBusiness } = useOnboarding()
  const [emailSent, setEmailSent] = useState(false)
  const [businessEmail, setBusinessEmail] = useState("")
  const { mutateAsync: sendVerifyEmail, isPending: isSending } = useBusinessVerifyEmail()
  const { mutateAsync: createBusiness, isPending: isCreating } = useBusinessCreate()
  const { mutateAsync: verifyCodeFromEmail, isPending: isVerifying } = useVerifyCodeFromEmail()

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (value === "yes") {
      const res = await createBusiness({ business: { email: user!.email, createdBy: user!.id }, userId: user!.id })
      if (res.status === "success") {
        setBusiness({ ...business, id: res.data.id } as Business)
        next?.()
      }
    } else {
      handleSend()
    }
  }

  const handleVerifyCode = async (code: string) => {
    const res = await verifyCodeFromEmail({ business: { email: businessEmail, ownerId: user!.id, createdBy: user!.id }, code })
    if (res.status === "success") {
      setBusiness({ ...business, ...res.data } as Business)
      next?.()
    }
  }

  const handleSend = async () => {
    const res = await sendVerifyEmail({ email: businessEmail, user_id: user!.id })
    if (res.status === "success") {
      setEmailSent(true)
      setBusiness({ ...business, id: res.data.id } as Business)
    }
  }



  return (

    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <h2 className="text-lg font-medium mb-6">Does your business use this email ?</h2>
        <div>
          <label htmlFor="useEmail" className="block text-sm font-medium mb-1">
            Email*
          </label>
          <p
            id="userEmail"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100`}
          >{user?.email}</p>
        </div>

        <div>
          <Radio
            name="radio"
            options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
            selectedValue={value}
            onChange={setValue}
          />
        </div>

        {value === "no" && (
          <div className="space-y-6">
            <label htmlFor="businessEmail" className="block text-sm font-medium mb-1">
              Please enter business email*
            </label>
            <input
              id="businessEmail"
              type="text"
              placeholder="Email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100`}
            />
            {businessEmail && !isValidEmail(businessEmail) && <p className="mt-1 text-sm text-red-600">Invalid email address</p>}
          </div>
        )}

        <button
          disabled={isCreating || isSending}
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isSending || isCreating ? "Sending..." : "Send & Continue"}
        </button>
      </div>
      <VerifyCodeModal
        next={next!}
        sendVerifyCode={handleVerifyCode}
        isOpen={emailSent}
        isVerifying={isVerifying}
        handleResend={handleSend}
        onClose={() => setEmailSent(false)}
      />
    </div >
  )
}
