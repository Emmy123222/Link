'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authcontext'
// import Image from 'next/image'
import { SiXero } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Image } from "@/components/ui/image"
import { redirect } from "next/navigation"

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

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      window.location.href = '/dashboard'
    } else {
      alert('Login failed')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    // <form className='max-w-[480px] mx-auto mt-8 flex flex-col gap-4' onSubmit={handleSubmit}>
    //   <input type="email" name="email" className='border rounded py-2 px-4' required />
    //   <input type="password" name="password" className='border rounded py-2 px-4' required />
    //   <button className='bg-green-600 py-2 px-4 rounded'>Login</button>
    //   <p>Don't have an account? <Link href={'/signup'}>Sign Up</Link></p>
    // </form>
    <div className="min-h-screen grid grid-rows-7 grid-cols-2 md:flex-row p-5 gap-10 bg-[#f1f1f1]">
      {/* Left section with illustration and text */}
      <div className="mb-8 col-span-2 row-span-1 flex justify-center align-middle">
        <Image src="/logo.svg" alt="Paylists Logo" width={150} height={40} />
      </div>
      <div className="hidden w-full md:col-span-1 md:row-span-5 md:flex justify-end">
        <Image src="/images/registration.svg" alt="Invoice illustration" width={500} height={400} priority />
      </div>

      {/* Right section with login form */}
      <div className="col-span-2 md:col-span-1 row-span-5 flex justify-start items-center">
        <div className="max-w-md w-full h-fit mx-auto md:mx-8 shadow-lg shadow-gray-400 p-10 bg-white rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}  className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                name="email"
                label="Email*"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <PasswordInput
                id="password"
                name="password"
                label="Password*"
                placeholder="Enter your password"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              "Log in"
            </Button>
          </form>

          {/* <div className="mt-6 bg-red-500">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SiXero size={20} className="mr-3 text-sky-500" />
                Sign in with XERO
              </Button>
            </div>
          </div> */}

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
                register
              </Link>
            </p>
          </div>

          {/* Legal Links */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs">
            <p className="text-gray-500">
              <Link href="/user-agreement" className="text-blue-600 hover:text-blue-800 underline">
                User Agreement
              </Link>
              {" | "}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page