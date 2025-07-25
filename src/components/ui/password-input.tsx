import { useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function PasswordInput({ label, error, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        label={label}
        error={error}
        className={className}
        {...props}
      />
      <Button
        variant="ghost"
        className="absolute top-[2rem] right-1 pr-3 w-[30px] h-[30px] bg-white flex items-center text-gray-500 z-20 px-0 py-1"
        onClick={() => setShowPassword(!showPassword)}
        type="button"
      >
        {showPassword ? (
          <IoMdEyeOff size={20} />
        ) : (
          <IoMdEye size={20} />
        )}
      </Button>
    </div>
  )
} 