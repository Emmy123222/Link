"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { Image } from "@/components/ui/image"
import { useRouter } from "next/navigation"

const guestRegistrationSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  verifyPassword: z.string().min(1, { message: "Please confirm your password" }),
  agreeToUserAgreement: z.boolean().refine((val) => val === true, { 
    message: "You must agree to the User Agreement to continue" 
  }),
  agreeToPrivacyPolicy: z.boolean().refine((val) => val === true, { 
    message: "You must agree to the Privacy Policy to continue" 
  }),
}).refine((data) => data.password === data.verifyPassword, {
  message: "Passwords do not match",
  path: ["verifyPassword"],
})

export type GuestRegistrationFormValues = z.infer<typeof guestRegistrationSchema>

interface GuestUserRegistrationProps {
  email: string
  paymentRequestId?: string
  onSuccess?: () => void
}

export default function GuestUserRegistration({ 
  email, 
  paymentRequestId, 
  onSuccess 
}: GuestUserRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestRegistrationFormValues>({
    resolver: zodResolver(guestRegistrationSchema),
    defaultValues: {
      password: "",
      verifyPassword: "",
      agreeToUserAgreement: false,
      agreeToPrivacyPolicy: false,
    },
  })

  const onSubmit = async (data: GuestRegistrationFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/guest-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: data.password,
          paymentRequestId,
          userAgreementAccepted: true,
          privacyPolicyAccepted: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to convert guest user')
      }

      const result = await response.json()
      
      if (result.success) {
        // Redirect to payment request or dashboard
        const redirectPath = paymentRequestId 
          ? `/payments-out/${paymentRequestId}` 
          : '/dashboard'
        router.push(redirectPath)
        onSuccess?.()
      } else {
        throw new Error(result.error || 'Conversion failed')
      }
    } catch (error) {
      console.error("Guest conversion error:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-rows-7 grid-cols-2 md:flex-row p-5 gap-10 bg-background">
      {/* Logo section */}
      <div className="col-span-2 row-span-1 flex justify-center">
        <Image src="/logo.svg" alt="Paylists Logo" width={150} height={40} />
      </div>

      {/* Illustration section */}
      <div className="hidden w-full md:col-span-1 md:row-span-6 md:flex justify-end items-center">
        <Image 
          src="/images/registration.svg" 
          alt="Welcome illustration" 
          width={500} 
          height={400} 
          priority 
        />
      </div>

      {/* Registration form section */}
      <div className="col-span-2 md:col-span-1 row-span-6 flex justify-start items-center">
        <div className="max-w-md w-full h-fit mx-auto md:mx-8 shadow-lg p-10 bg-card rounded-2xl border">
          <h2 className="text-2xl font-semibold mb-2 text-center text-foreground">Welcome to Paylists!</h2>
          <p className="text-muted-foreground text-center mb-6">
            Complete your registration to manage your business payments
          </p>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Email:</strong> {email}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <PasswordInput
                id="password"
                label="Create Password*"
                error={errors.password?.message}
                placeholder="Enter your password"
                className="w-full"
                {...register("password")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <PasswordInput
                id="verifyPassword"
                label="Confirm Password*"
                error={errors.verifyPassword?.message}
                placeholder="Confirm your password"
                className="w-full"
                {...register("verifyPassword")}
              />
            </div>

            {/* User Agreement Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToUserAgreement"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                  {...register("agreeToUserAgreement")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToUserAgreement" className="text-foreground">
                  I agree to the{" "}
                  <Link 
                    href="/user-agreement" 
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    User Agreement
                  </Link>
                </label>
                {errors.agreeToUserAgreement && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.agreeToUserAgreement.message}
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToPrivacyPolicy"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                  {...register("agreeToPrivacyPolicy")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToPrivacyPolicy" className="text-foreground">
                  I agree to the{" "}
                  <Link 
                    href="/privacy-policy" 
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeToPrivacyPolicy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.agreeToPrivacyPolicy.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
