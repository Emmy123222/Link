'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authcontext'
import { Image } from "@/components/ui/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
// import { SiXero } from "react-icons/si"
// import { ConfirmSendEmailModal } from "@/components/confirmSendEmailModal"

const page = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    // Send signup request to your API
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      window.location.href = '/login'
    } else {
      alert('Signup failed')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    // <form
    //   className='max-w-[480px] mx-auto mt-8 flex flex-col gap-4'
    //   onSubmit={handleSubmit}
    // >
    //   <input
    //     type="email"
    //     name="email"
    //     className='border rounded py-2 px-4'
    //     required
    //   />
    //   <input
    //     type="password"
    //     name="password"
    //     className='border rounded py-2 px-4'
    //     required
    //   />
    //   <button className='bg-green-600 py-2 px-4 rounded'>Sign Up</button>
    //   <p>
    //     Already have an account? <Link href={'/login'}>Login</Link>
    //   </p>
    // </form>

    <div className="min-h-screen grid grid-rows-7 grid-cols-2 md:flex-row p-5 gap-10 bg-[#f1f1f1]">
      {/* Left section with illustration and text */}
      <div className="col-span-2 row-span-1 flex justify-center">
        <Image src="/logo.svg" alt="Paylists Logo" width={150} height={40} />
      </div>
      <div className="hidden w-full md:col-span-1 md:row-span-6 md:flex justify-end items-center">
        <Image src="/images/registration.svg" alt="Invoice illustration" width={500} height={400} priority />
      </div>

      {/* Right section with login form */}
      <div className="col-span-2 md:col-span-1 row-span-6 flex justify-start items-center">
        <div className="max-w-md w-full h-fit mx-auto md:mx-8 shadow-lg shadow-gray-400 p-10 bg-white rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Registration</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email*"
                className="w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <PasswordInput
                id="password"
                name="password"
                label="Password*"
                className="w-full"
                placeholder="Enter your password"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be exactly 8 characters using only lowercase letters and digits
              </p>
            </div>

            <div>
              <PasswordInput
                id="verifyPassword"
                label="Verify password*"
                className="w-full"
                placeholder="Verify your password"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-600">
                  By continuing, you agree to the{" "}
                  <Link href="/user-agreement" className="text-blue-600 hover:underline">
                    User agreement
                  </Link>{" "}
                  and the{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy policy
                  </Link>
                </label>
                </div>
            </div>

            <Button
              type="submit"
              colorSchema="green"
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-green-600 text-sm font-medium text-gray-700 hover:bg-gray-50 text-white"
            >
              Create Account
            </Button>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SiXero size={20} className="mr-5 text-sky-500" />
                Sign up with XERO
              </Button>
            </div>
          </div> */}

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page