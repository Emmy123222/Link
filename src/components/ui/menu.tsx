"use client"

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MenuContextType {
  close: () => void
}

const MenuContext = createContext<MenuContextType | null>(null)

interface MenuProps {
  children: ReactNode
  className?: string
}

export function Menu({ children, className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <MenuContext.Provider value={{ close: () => setOpen(false) }}>
      <div className={cn("relative inline-block text-left", className)} ref={ref}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === MenuTrigger) {
              return React.cloneElement(child, { onClick: () => setOpen(prev => !prev) })
            }
            if (child.type === MenuContent && open) {
              return child
            }
          }
          return null
        })}
      </div>
    </MenuContext.Provider>
  )
}

interface MenuTriggerProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function MenuTrigger({ children, onClick, className }: MenuTriggerProps) {
  return (
    <div onClick={onClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  )
}

interface MenuContentProps {
  children: ReactNode
  className?: string
  align?: "left" | "right"
}

export function MenuContent({ children, className, align = "right" }: MenuContentProps) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[200px] rounded-md bg-white shadow-lg border border-gray-200 py-1",
        align === "right" ? "right-0" : "left-0",
        "mt-2",
        className
      )}
    >
      {children}
    </div>
  )
}

interface MenuItemProps {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  active?: boolean
  disabled?: boolean
  danger?: boolean
  className?: string
}

export function MenuItem({
  children,
  onClick,
  icon,
  active,
  disabled,
  danger,
  className
}: MenuItemProps) {
  const { close } = useContext(MenuContext)!

  return (
    <button
      className={cn(
        "flex items-center w-full px-4 py-2 text-sm text-left gap-2 truncate max-w-full",
        active ? "bg-green-100 text-green-700" : "hover:bg-green-50",
        danger ? "text-red-600 hover:bg-red-50" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={() => {
        if (!disabled) {
          onClick?.()
          close()
        }
      }}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  )
}

interface MenuSeparatorProps {
  className?: string
}

export function MenuSeparator({ className }: MenuSeparatorProps) {
  return (
    <div className={cn("border-t border-gray-200 my-1", className)} />
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) throw new Error("useMenu must be used within <Menu>")
  return context
} 