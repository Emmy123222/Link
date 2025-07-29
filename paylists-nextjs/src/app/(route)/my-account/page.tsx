"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangePasswordModal } from "@/components/changePasswordModal"
import { useApp } from "@/providers/AppProvider"
import { useUpdateProfile } from "@/hooks/use-user"
import { User } from "@/types/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PhoneInput from "@/components/phoneInput"
import * as z from "zod"

const accountSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	lastname: z.string().min(1, { message: "Last name is required" }),
	phone: z.string().min(1, { message: "Phone number is required" }),
	email: z.string().email({ message: "Invalid email address" }),
	label: z.number().min(1, { message: "Label is required" }),
	defaultBusiness: z.string().min(1, { message: "Default Business is required" }),
});

type AccountFormValues = z.infer<typeof accountSchema>

export default function MyAccountPage() {
	const { user, setUser, currentBusiness } = useApp()!
	const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)
	const [phone, setPhone] = useState<string>(user?.phone || "")
	const [label, setLabel] = useState<number>(user?.label as unknown as number || 0)
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<AccountFormValues>({
		resolver: zodResolver(accountSchema),
	})

	useEffect(() => {
		setValue("phone", user?.phone || "")
		setValue("email", user?.email || "")
		setValue("name", user?.name || "")
		setValue("lastname", user?.lastname || "")
		setValue("label", user?.label as unknown as number)
		setValue("defaultBusiness", currentBusiness?.business_name || "")
		setPhone(user?.phone || "")
		setLabel(user?.label as unknown as number || 0)
	}, [user, setValue, currentBusiness])

	const onSubmit = async (data: AccountFormValues) => {
		try {
			const updatedData = {
				...user,
				...data,
				phone,
				label,
			} as User;
			await updateProfile(updatedData);
			setUser(updatedData)
		} catch (error) {
			console.error(error);
		}
	}


	// const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = event.target.files?.[0]
	// 	if (file) {
	// 		// setValue("profileImage", file)
	// 		const reader = new FileReader()
	// 		reader.onload = (e) => {
	// 			setProfileImage(e.target?.result as string)
	// 		}
	// 		reader.readAsDataURL(file)
	// 	}
	// }

	return (

		<main className="flex-1 p-6 overflow-auto">
			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-lg shadow-sm p-8">
					<div className="space-y-6">
						{/* Profile Image */}
						<div className="flex flex-col justify-center mb-8">
							{/* <div className="relative w-20 h-20 m-auto">
								<div className="bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
									{profileImage ? (
										<img
											src={profileImage || "/placeholder.svg"}
											alt="Profile"
											className="w-full aspect-square object-cover"
										/>
									) : (
										<div className="w-full aspect-square bg-gray-200 rounded-full"></div>
									)}
								</div>
								<label
									htmlFor="profile-image"
									className="absolute bottom-0 right-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
								>
									<IoMdCamera className="w-4 h-4 text-white" />
									<input
										id="profile-image"
										type="file"
										accept="image/*"
										{...register("profileImage")}
										onChange={handleImageUpload}
										className="hidden"
									/>
								</label>
							</div>
							{errors.profileImage && <p className="mt-1 mx-auto text-sm text-red-600">{errors.profileImage.message}</p>} */}
						</div>
						{/* First Name */}
						<div>
							<label htmlFor="firstName" className="block text-sm text-gray-600 mb-1">
								First name*
							</label>
							<Input
								id="firstName"
								type="text"
								className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
								{...register("name")}
							/>
							{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
						</div>

						{/* Last Name */}
						<div>
							<label htmlFor="lastName" className="block text-sm text-gray-600 mb-1">
								Last name*
							</label>
							<Input
								id="lastName"
								type="text"
								className={`w-full px-3 py-2 border ${errors.lastname ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
								{...register("lastname")}
							/>
							{errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>}
						</div>
						<PhoneInput
							value={phone}
							onChange={(value: string) => {
								setPhone(value)
								setValue("phone", value)
							}}
							onCountryChange={(value: number) => {
								setLabel(value)
								setValue("label", value)
							}}
							defaultCountryId={label}
							defaultPhoneNumber={phone}
						/>
						{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm text-gray-600 mb-1">
								Email
							</label>
							<Input
								id="email"
								type="email"
								disabled
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
								{...register("email")}
							/>
							<p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm text-gray-600 mb-1">
								Default Business
							</label>
							<Input
								id="defaultBusiness"
								type="text"
								disabled
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
								{...register("defaultBusiness")}
							/>
							<p className="mt-1 text-xs text-gray-500">Default Business cannot be changed</p>
						</div>
						{/* 
						Default Document
						<div>
							<label htmlFor="defaultPaymentDocument" className="block text-sm text-gray-600 mb-1">
								Default document
							</label>
							<div className="relative">
								<select
									id="defaultPaymentDocument"
									className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
									{...register("defaultPaymentDocument")}
									defaultValue={user?.defaultPaymentDocument || "1"}
								>
									<option value="1">Payment Request</option>
									<option value="2">Invoice</option>
									<option value="3">Planning Payment</option>
									<option value="4">Bill of Lading</option>
								</select>
								<IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
							</div>

						</div>

						<div>
							<label htmlFor="activePlanningPayments" className="block text-sm text-gray-600 mb-1">
								Active planning payments
							</label>
							<div className="relative">
								<select
									id="activePlanningPayments"
									className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
								// {...register("activePlanningPayments")}
								>
									<option value="false">No</option>
									<option value="true">Yes</option>
								</select>
								<IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
							</div>
						</div> */}
						<div className="pt-4">
							<Button
								variant="primary"
								colorSchema="gray"
								onClick={() => setShowPasswordModal(true)}
							>
								CHANGE PASSWORD
							</Button>
						</div>

						{/* Save Button */}
						<Button
							type="button"
							onClick={handleSubmit(onSubmit)}
							colorSchema="green"
							className="w-full"
						>
							{isUpdating ? "Saving..." : "Save Changes"}
						</Button>

					</div>
				</div>
			</div>
			<ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
		</main>
	)
}
