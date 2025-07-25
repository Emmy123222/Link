// "use client"

// import { useRef, useEffect } from "react"
// import Link from "next/link"
// import { useApp } from "@/providers/AppProvider"

// interface UserAccountDropdownProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export function UserAccountDropdown({ isOpen, onClose }: UserAccountDropdownProps) {
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const { logout } = useApp()!
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   return (
//     <div
//       ref={dropdownRef}
//       className="fixed right-2 top-12 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in"
//     >
//       <div className="py-1">
//         <Link
//           href="/my-account"
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           onClick={onClose}
//         >
//           My account
//         </Link>
//         <Link
//           href="#"
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           onClick={onClose}
//         >
//           Billing & packages
//         </Link>
//         <div className="border-t border-gray-200 my-1"></div>
//         <Link
//           href="/user-agreement"
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           onClick={onClose}
//         >
//           User Agreement
//         </Link>
//         <Link
//           href="/privacy-policy"
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           onClick={onClose}
//         >
//           Privacy Policy
//         </Link>
//         <div className="border-t border-gray-200 my-1"></div>
//         <button
//           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           onClick={() => {
//             logout()
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// }
