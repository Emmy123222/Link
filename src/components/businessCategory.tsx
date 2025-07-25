// "use client"

// import { useBusinessCategory } from "@/hooks/use-businesses"

// type Props = {
//   onChange?: (e: any) => void
//   disabled?: boolean
//   disabledValue?: any
//   ref?: any
//   name?: string
//   onBlur?: (e: any) => void
// }

// export default function BusinessCategory({ onChange, disabled, onBlur, ref, name }: Props) {
//   const { data: categories } = useBusinessCategory();

//   return (
//     <div className="space-y-2">
//       <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//         onChange={onChange}
//         disabled={disabled}
//         onBlur={onBlur}
//         ref={ref}
//         name={name}
//       >
//         {categories?.map((category: any, index: number) => (
//           <option key={index} value={category.id}>{category.business_category}</option>
//         ))}
//         {categories?.length === 0 && (
//           <option value="">No categories found</option>
//         )}
//       </select>
//     </div>
//   )
// }
