"use client"

import { useState, useRef, useEffect } from "react"
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/lib/utils/api";

type Props = {
  next: () => void;
  isOpen: boolean;
  onClose: () => void;
  sendVerifyCode: (data: any) => void;
  handleResend: () => void;
  isVerifying: boolean;
};

export default function VerifyCodeModal({ next, sendVerifyCode, isOpen, onClose, isVerifying, handleResend }: Props) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]+$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (verificationCode[index]) {
        const newCode = [...verificationCode]
        newCode[index] = ""
        setVerificationCode(newCode)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join("")
    if (code.length !== 6) return
    await sendVerifyCode(code)
  }
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verify Code</h2>
          <Button onClick={onClose} colorSchema="white" variant="outline" aria-label="Close">
            <IoClose size={20} />
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit verification code to you. Please enter it below.
          </p>
          <div className="flex justify-between mb-6">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                ref={(el: HTMLInputElement | null) => void (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-lg font-medium border border-gray-300 rounded-md"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || verificationCode.join("").length !== 6}
            variant="primary"
            colorSchema="green"
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>

          <div className="mt-4 text-center">
            <Button onClick={handleResend} colorSchema="green" variant="ghost">
              Didn't receive a code? Resend
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}
