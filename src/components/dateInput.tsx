
import React from "react"
import { cn } from "@/lib/utils"

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function DateInput({ label, error, className, ...props }: DateInputProps) {
  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="date"
        className={cn(
          "block w-full rounded-lg border px-3 py-2 text-sm transition-all duration-150",
          "bg-white text-gray-900 border-gray-300 placeholder-gray-400",
          "focus:ring-2 focus:ring-green-500/40 focus:border-green-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/30 pr-8",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
