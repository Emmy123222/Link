"use client"

import { useRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { changePasswordSchema, ChangePasswordFormValues } from "@/lib/validations/auth"
import { useChangePassword } from "@/hooks/use-user"
import { redirect } from "next/navigation";
import { PasswordInput } from "./ui/password-input";
import { Button } from "./ui/button";
import { useApp } from "@/providers/AppProvider";

interface ChangePasswordModal {
	isOpen: boolean
	onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModal) {
	const modalRef = useRef<HTMLDivElement>(null)
	const { mutateAsync: changePassword, isPending: isChangePasswordPending } = useChangePassword()
	const { logout } = useApp()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	})

	const onSubmit = async (data: ChangePasswordFormValues) => {
		await changePassword({ newPassword: data.newPassword })
		await logout()
	}

	// Close modal when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen, onClose])

	// Close modal on ESC key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}

		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown)
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
			<div ref={modalRef} className="bg-white rounded-lg shadow-lg w-4/5 max-w-md p-6 animate-fade-in">
				<div className="w-full max-w-md flex justify-center">
					<p className="text-2xl font-bold">Change Password</p>
				</div>
				<div className="w-full max-w-md flex justify-center">
					<p className="text-sm text-gray-500">Please enter your new password</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Profile Image */}
					<div className="flex justify-center mb-8">
					</div>
					{/* First Name */}
					<div>
						<PasswordInput
							label="New password*"
							placeholder="please input new password"
							error={errors.newPassword?.message}
							{...register("newPassword")}
						/>
						<p className="mt-1 text-xs text-gray-500">
							Password must be exactly 8 characters using only lowercase letters and digits
						</p>
					</div>
					<div>
						<PasswordInput
							label="Confirm password*"
							placeholder="please input confirm password"
							error={errors.confirmPassword?.message}
							{...register("confirmPassword")}
						/>
					</div>

					{/* Save Button */}
					<div className="flex gap-4 ">
						<Button
							type="submit"
							disabled={isChangePasswordPending}
							variant="primary"
							colorSchema="green"
							className="w-full"
						>
							{isChangePasswordPending ? "Changing..." : "Change"}
						</Button>
						<Button
							type="submit"
							disabled={isChangePasswordPending}
							onClick={() => onClose()}
							variant="secondary"
							colorSchema="gray"
							className="w-full"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div >
		</div >
	)
}
