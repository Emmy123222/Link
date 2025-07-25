"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"

const routes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/payments-in", name: "Payments to receive" },
    { path: "/payments-out", name: "Payments to pay" },
    { path: "/customers", name: "Customers" },
    { path: "/vendors", name: "Vendors" },
    { path: "/business", name: "My business" }
]
interface MenuListDropdownProps {
    isOpen: boolean
    onClose: () => void
}

export function MenuListDropdown({ isOpen, onClose }: MenuListDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="fixed left-2 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in"
        >
            <div className="py-1">
                {routes.map((route) => (
                    <Link
                        key={route.path}
                        href={route.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        {route.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
