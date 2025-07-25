// import { useEffect, useState, useRef } from "react"
// import { useAutoCompleteCompany } from "@/hooks/use-autocomplete"
// import { ChevronDown } from "lucide-react"
// import { FaSpinner } from "react-icons/fa"
// import { Company } from "@/types/country"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// type Props = {
//   setCompany: (company: Company) => void
// }

// export default function AutoCompleteCompany({ setCompany, }: Props) {
//   const [companySearchTerm, setCompanySearchTerm] = useState<string>("")
//   const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const { mutateAsync: getCompany, data: res, isPending } = useAutoCompleteCompany()

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowCompanyDropdown(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   useEffect(() => {
//     const fetch = async () => {
//       if (companySearchTerm.trim()) {
//         await getCompany(companySearchTerm)
//       }
//     }
//     fetch()
//   }, [companySearchTerm])

//   const handleCompanySelect = async (company: Company) => {
//     setCompany(company)
//     setCompanySearchTerm(company.title)
//     setShowCompanyDropdown(false)
//   }

//   return (
//     <div className="relative">
//       <Input
//         id="companySearch"
//         type="text"
//         value={companySearchTerm}
//         onChange={(e) => setCompanySearchTerm(e.target.value)}
//         onFocus={() => setShowCompanyDropdown(true)}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
//         placeholder="Search for a company..."
//       />

//       {isPending ? (<FaSpinner className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none animate-spin" />) : (<ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />)}

//       {/* Company Dropdown */}
//       {
//         showCompanyDropdown && (
//           <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
//             {res?.items?.map((company: Company, index: number) => (
//               <button
//                 key={index}
//                 type="button"
//                 className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
//                 onClick={() => handleCompanySelect(company)}
//               >
//                 {company.title}
//               </button>
//             ))}
//             {res?.items?.length === 0 && (
//               <div className="px-3 py-2 text-sm text-gray-500">Companies not found</div>
//             )}
//           </div>
//         )
//       }
//     </div >
//   )
// }