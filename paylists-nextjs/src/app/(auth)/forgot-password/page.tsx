"use client"

import { Image } from "@/components/ui/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSendResetPasswordEmail } from "@/hooks/use-user"
import { IoMdArrowBack, IoMdArrowDropupCircle, IoMdClose } from "react-icons/io"
import { Button } from "@/components/ui/button"

// Form validation schema
const forgotPasswordSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {


	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	})

	const { mutateAsync: sendResetPasswordEmail, isPending } = useSendResetPasswordEmail()

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		await sendResetPasswordEmail({ userEmail: data.email })
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
				{isPending ? (
					<div className="text-center">
						<h1 className="text-2xl font-semibold mb-4">Check your email</h1>
						<p className="text-gray-600 mb-6">
							We've sent a password reset link to your email address. Please check your inbox.
						</p>
						<Link
							href="/login"
							className="block w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
						>
							Return to login
						</Link>
					</div>
				) : (
					<>
						<h1 className="text-2xl font-semibold mb-6 text-center">Forgot password</h1>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<div className="relative">
									<input
										id="email"
										type="email"
										className={`w-full px-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"
											} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10`}
										placeholder="Email*"
										{...register("email")}
									/>
									{errors.email && (
										<div className="absolute inset-y-0 right-0 flex items-center pr-3">
											<IoMdArrowDropupCircle className="h-5 w-5 text-red-500" />
											<Button type="button" variant="destructive" className="ml-1 text-white" onClick={() => reset()}>
												<IoMdClose className="h-5 w-5" />
											</Button>
										</div>
									)}
								</div>
								{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
							</div>

							<Button
								type="submit"
								variant="default"
								colorSchema="green"
								disabled={isPending}
								className="w-full"
							>
								{isPending ? "Processing..." : "Reset my password"}
							</Button>
						</form>
					</>
				)}

				{/* Legal Links */}
				<div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs">
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
	)
}
