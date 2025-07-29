"use client"

import { Image } from "@/components/ui/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from '@/lib/supabaseClient'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validations/auth"
import { IoMdAlert, IoMdArrowBack } from "react-icons/io"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        throw error
      }

      toast.success("Password updated successfully")
      router.push("/login")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error(error instanceof Error ? error.message : "Failed to reset password")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] flex flex-col items-center p-4">
      {/* Logo */}
      <div className="w-full max-w-md mt-8 mb-12">
        <Image src="/logo.svg" alt="Paylists Logo" className="mx-auto" width={150} height={40} />
      </div>

      {/* Back to login link */}
      <div className="w-full max-w-md mb-8">
        <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-900">
          <IoMdArrowBack className="mr-2 h-4 w-4" />
          <span>Back to login</span>
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Reset your password</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <PasswordInput
              id="password"
              type="password"
              label="New password*"
              className="w-full"
              error={errors.password?.message}
              placeholder="New password*"
              {...register("password")}
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be exactly 8 characters using only lowercase letters and digits
            </p>
          </div>

          <div>
            <PasswordInput
              id="confirmPassword"
              type="password"
              label="Confirm new password*"
              className="w-full"
              error={errors.confirmPassword?.message}
              placeholder="Confirm new password*"
              {...register("confirmPassword")}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            colorSchema="green"
            className="w-full"
          >
            Update password
          </Button>
        </form>
      </div >
    </div >
  )
} 