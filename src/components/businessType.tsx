// "use client"

// import React from 'react'
// import { BusinessTypes } from '@/constants/business'

// type Props = {
//   onChange?: (e: any) => void
//   disabled?: boolean
//   onBlur?: (e: any) => void
//   ref?: any
//   name?: string
// }

// export default function BusinessType({ onChange, disabled, onBlur, ref, name }: Props) {

//   return (
//     <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//       onChange={onChange}
//       disabled={disabled}
//       onBlur={onBlur}
//       ref={ref}
//       name={name}
//     >
//       {BusinessTypes.map((type: any, index: number) => (
//         <option key={index} value={type.id}>{type.name}</option>
//       ))}
//     </select>
//   )
// } 