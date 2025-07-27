import React from "react"
import type { CardProps } from "@/types/card"

export function Card({ badge, badgeIcon, image, title, children, onClick }: CardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm flex flex-col items-center w-full max-w-xs mx-auto cursor-pointer" onClick={onClick}>
      {badge && (
        <div className="flex items-center gap-1 mb-2 self-start">
          {badgeIcon}
          <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{badge}</span>
        </div>
      )}
      {image && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
          {image}
        </div>
      )}
      <div className="font-semibold text-lg text-center mb-1">{title}</div>
      <div className="text-center text-gray-700 text-sm whitespace-pre-line">{children}</div>
    </div>
  )
}
