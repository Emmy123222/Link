"use client"

import React, { useRef, useEffect, useState, ReactNode } from "react"

export interface ContextMenuItem {
  icon?: ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  danger?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  open: boolean
  onClose: () => void
  anchorPoint?: { x: number; y: number }
  className?: string
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  open,
  onClose,
  anchorPoint,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={`absolute top-0 left-0 right-0 z-50 min-w-[200px] rounded-md bg-white shadow-lg border border-gray-200 py-1 ${className}`}
      style={anchorPoint ? { left: anchorPoint.x, top: anchorPoint.y } : {}}
    >
      {items.map((item, idx) => (
        <button
          key={item.label + idx}
          className={`flex items-center w-full px-4 py-2 text-sm text-left gap-2 truncate max-w-full
            ${item.active ? "bg-green-100 text-green-700" : "hover:bg-green-50"}
            ${item.danger ? "text-red-600 hover:bg-red-50" : ""}
            ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          onClick={() => {
            if (!item.disabled) {
              item.onClick?.()
              onClose()
            }
          }}
          disabled={item.disabled}
          tabIndex={item.disabled ? -1 : 0}
        >
          {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
          <span className="truncate">{item.label}</span>
        </button>
      ))}
    </div>
  )
} 