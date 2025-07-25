"use client"

import { Image } from "@/components/ui/image"

type RegisterConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onResend?: () => void
  email?: string
  isResending?: boolean
}

export function RegisterConfirmModal({ isOpen, onClose, onResend, email, isResending = false }: RegisterConfirmModalProps) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">

        {/* Email illustration */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/check.svg"
            alt="Email verification illustration"
            width={200}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Main message */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Email Verification Successfull.
          </h2>
        </div>

        {/* OK button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-white border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium mb-6"
        >
          OK
        </button>

      </div>
    </div>
  )
}
