// import { useEffect, useState, useRef } from "react"
// import { useAutoCompleteAddress } from "@/hooks/use-autocomplete"
// import { FiChevronDown, FiLoader } from "react-icons/fi"
// import { AddressSuggestion } from "@/types/country"
// import { Address } from "@/types/country"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// type Props = {
//   setAddress: (address: Partial<Address>) => void
//   disabled?: boolean
// }

// export default function AutoCompleteAddress({ setAddress, disabled }: Props) {
//   const [addressSearchTerm, setAddressSearchTerm] = useState<string>("")
//   const [showAddressDropdown, setShowAddressDropdown] = useState<boolean>(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const { mutateAsync: getAddress, data: res, isPending } = useAutoCompleteAddress()

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowAddressDropdown(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   useEffect(() => {
//     const fetch = async () => {
//       if (addressSearchTerm.trim()) {
//         await getAddress(addressSearchTerm)
//       }
//     }
//     fetch()
//   }, [addressSearchTerm])

//   const handleAddressSelect = async (address: AddressSuggestion) => {
//     const selectedAddress = await getAddress(address.url) as unknown as Address;
//     const data: Partial<Address> = {
//       town_or_city: selectedAddress.town_or_city,
//       postcode: selectedAddress.postcode,
//       line_1: selectedAddress.line_1,
//       line_2: selectedAddress.line_2,
//     }
//     setAddress(data)
//   }

//   return (
//     <div className="relative">

//       <div className="relative">
//         <Input
//           id="addressSearch"
//           type="text"
//           value={addressSearchTerm}
//           label="Find your address, start writing... (UK only)"
//           onChange={(e) => {
//             setAddressSearchTerm(e.target.value)
//             setShowAddressDropdown(true)
//           }}
//           onFocus={() => setShowAddressDropdown(true)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
//           placeholder="Search for an address..."
//           disabled={disabled}
//         />
//         {isPending ? (<FiLoader className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 pointer-events-none animate-spin" />) : (<FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />)}
//       </div>

//       {/* Address Dropdown */}
//       {showAddressDropdown && (
//         <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
//           {res?.suggestions?.map((address: any, index: number) => (
//             <button
//               key={index}
//               className="w-full px-3 py-2 text-left hover:bg-gray-200 focus:bg-gray-200 focus:outline-none text-sm"
//               onClick={() => handleAddressSelect(address)}
//             >
//               {address.address}
//             </button>
//           ))}
//           {res?.suggestions?.length === 0 && (
//             <div className="px-3 py-2 text-sm text-gray-500">Addresses not found</div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }