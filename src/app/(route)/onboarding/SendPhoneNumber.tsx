import { useState } from "react"
import { usePhoneVerify, useSendSms, useUpdateProfile } from "@/hooks/use-user"
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/phoneInput";
import VerifyCodeModal from "@/components/VerifyCodeModal";
import { useApp } from "@/providers/AppProvider";

type Props = {
  next: () => void;
};

export default function SendPhoneNumber({ next }: Props) {
  const { user, setUser } = useApp()!
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [phoneCode, setPhoneCode] = useState<string>("")
  const [phoneCodeAreaId, setPhoneCodeAreaId] = useState<number>(0)
  const { mutateAsync: sendSms, isPending } = useSendSms();
  const { mutateAsync: sendVerifyCode, isPending: isVerifying } = usePhoneVerify();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false)

  const handleSendSms = async () => {
    if (!phoneNumber) return
    const fullPhoneNumber = phoneCode + phoneNumber
    const data = await sendSms(fullPhoneNumber)
    if (data?.status === "success") {
      setShowVerifyCodeModal(true)
    }
  }

  const handleCloseVerifyCodeModal = () => {
    setShowVerifyCodeModal(false)
    setPhoneNumber("")
  }

  const handleVerifyCode = async (code: string) => {
    const res = await sendVerifyCode({ phoneNumber: phoneCode + phoneNumber, code, user_id: user!.id })
    if (res.status === "success") {
      // Update user profile with verified phone number
      const updatedUserData = {
        id: user!.id,
        phone: phoneNumber,
        label: phoneCodeAreaId, // This represents the phone area code ID
      }
      
      const updateRes = await updateProfile(updatedUserData)
      if (updateRes.status === "success") {
        // Update the user context with the new phone data
        setUser({
          ...user!,
          phone: phoneNumber,
          label: phoneCodeAreaId,
        })
      }
      next()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm py-8 px-4 sm:px-8 max-w-md mx-auto">
      <h2 className="text-lg font-medium mb-6">Please add your mobile number</h2>
      <PhoneInput
        value={phoneNumber}
        onChange={(value) => setPhoneNumber(value)}
        onPhoneCodeChange={(code) => setPhoneCode(code)}
        onCountryChange={(countryId) => setPhoneCodeAreaId(countryId)}
      />
      <div className="flex gap-4 mt-4">
        <Button
          colorSchema="green"
          onClick={handleSendSms}
          disabled={isPending}
          className="flex-1"
        >
          Send code to verify phone number
        </Button>
      </div>
      <VerifyCodeModal
        next={next}
        handleResend={handleSendSms}
        sendVerifyCode={handleVerifyCode}
        isOpen={showVerifyCodeModal}
        onClose={handleCloseVerifyCodeModal}
        isVerifying={isVerifying}
      />
    </div>
  );
}