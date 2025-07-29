
"use client"

import { useId } from "react"

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}
export default function Checkbox({ label, checked, onChange, disabled = false }: Props) {
  const id = useId()

  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer hidden"
      />
      <div className={`
        w-5 h-5 flex items-center justify-center border-2 rounded
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
        disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? "bg-green-600 border-green-600" : "border-gray-300 bg-white"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}>
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-800"}`}>{label}</span>
    </label>
  )
}
