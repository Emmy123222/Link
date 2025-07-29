"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { SiXero } from "react-icons/si"
import { useApp } from "@/providers/AppProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Image } from "@/components/ui/image"
import { redirect } from "next/navigation"

export default function LoginPage() {
  const { login, isLoadingUser } = useApp()!

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const res = await login(data)
    if (res.status === "success") {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen grid grid-rows-7 grid-cols-2 md:flex-row p-5 gap-10 bg-muted">
      {/* Left section with illustration and text */}
      <div className="mb-8 col-span-2 row-span-1 flex justify-center align-middle">
        <Image src="/logo.svg" alt="Paylists Logo" width={150} height={40} />
      </div>
      <div className="hidden w-full md:col-span-1 md:row-span-5 md:flex justify-end">
        <Image src="/images/registration.svg" alt="Invoice illustration" width={500} height={400} priority />
      </div>

      {/* Right section with login form */}
      <div className="col-span-2 md:col-span-1 row-span-5 flex justify-start items-center">
        <div className="max-w-md w-full h-fit mx-auto md:mx-8 shadow-lg p-10 bg-card rounded-2xl border">
          <h2 className="text-3xl font-semibold mb-6 text-center text-foreground">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                label="Email*"
                error={errors.email?.message}
                placeholder="Enter your email"
                {...register("email")}
                className="text-black placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <PasswordInput
                id="password"
                label="Password*"
                error={errors.password?.message}
                placeholder="Enter your password"
                className="w-full text-black"
                {...register("password")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 border-border rounded text-green-600 focus:ring-green-500"
                  {...register("rememberMe")}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground">
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
              disabled={isLoadingUser}
              variant="primary"
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoadingUser ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-card text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                <SiXero size={20} className="mr-3 text-sky-500" />
                Sign in with XERO
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                register
              </Link>
            </p>
          </div>

          {/* Legal Links */}
          <div className="mt-4 pt-4 border-t border-border text-center text-xs">
            <p className="text-muted-foreground">
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
