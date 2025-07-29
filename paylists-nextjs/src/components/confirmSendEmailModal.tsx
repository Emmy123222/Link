"use client"

import { Image } from "@/components/ui/image"

type ConfirmSendEmailModalProps = {
  isOpen: boolean
  onClose: () => void
  onResend?: () => void
  email?: string
  isResending?: boolean
  onGoToLogin?: () => void
}

export function ConfirmSendEmailModal({ isOpen, onClose, onResend, email, isResending = false, onGoToLogin }: ConfirmSendEmailModalProps) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">

        {/* Email illustration */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/verification-sent.svg"
            alt="Email verification illustration"
            width={200}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Main message */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Verification email has been sent to your email address. Please check your inbox.
          </h2>
          {email && (
            <p className="text-sm text-gray-600">
              Email sent to: <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        {/* OK button */}
        <button
          onClick={onGoToLogin || onClose}
          className="w-full py-3 px-4 bg-white border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium mb-6"
        >
          OK
        </button>

        {/* Resend option */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Haven't received an email?{" "}
            <button
              onClick={onResend}
              disabled={isResending}
              className="text-gray-900 font-medium hover:text-green-600 transition-colors disabled:opacity-50"
            >
              {isResending ? "SENDING..." : "RESEND"}
            </button>
          </p>

          <p className="text-xs text-gray-500">
            In case you haven't received an email, please check the spam box as well.
          </p>
        </div>
      </div>
    </div>
  )
}
