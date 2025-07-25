// import React from 'react'
// import { Avatar } from './avatar'
// import { Business } from '@/types/business'
// import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'
// import { Badge } from './ui/badge'
// import { getEntityTypeFromBusinessType } from '@/utils/imageUtils'

// export const BusinessItemCard = ({
//   business,
//   verified,
//   children,
// }: {
//   business: Business,
//   verified: boolean,
//   children?: React.ReactNode
// }) => {
//   const entityType = getEntityTypeFromBusinessType(business?.business_type);
  
//   return (
//     <div className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded overflow-hidden shadow-lg flex flex-col items-stretch py-6 px-4 relative bg-white">
//       <Badge
//         variant={verified ? "success" : "error"}
//         className="absolute top-2 right-2 flex items-center gap-1 z-10"
//       >
//         {verified
//           ? (<><IoMdCheckmarkCircle className="text-green-500" size={16} /> Verified</>)
//           : (<><IoMdCloseCircle className="text-yellow-500" size={16} /> Unverified</>)}
//       </Badge>
//       <div className="flex justify-center mb-4">
//         <Avatar 
//           src={business?.logo_url || null} 
//           name={business?.business_name || "Business"} 
//           width={120} 
//           height={120} 
//           className="w-24 h-24"
//           entityType={entityType}
//         />
//       </div>
//       <div className="px-2 py-2 flex flex-col gap-1">
//         <div className="font-bold text-lg sm:text-xl mb-1 break-words">{business?.business_name}</div>
//         <p className="text-gray-900 text-base break-all">{business?.email}</p>
//         <p className="text-gray-700 text-base mb-1 break-words">{business?.business_type}</p>
//         <p className="text-gray-700 text-base mt-2 break-words">
//           {business?.city}, {typeof business?.countryCode === 'object' ? (business?.countryCode as any).countryName : business?.countryCode}
//         </p>
//       </div>
//       <div className="px-2 pt-2">
//         <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 break-all">
//           {business?.registration_number}
//         </span>
//       </div>
//       {children}
//     </div>
//   )
// }