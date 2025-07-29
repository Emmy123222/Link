"use client"

import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  width?: string
}

export function Drawer({ isOpen, onClose, children, title, width = "max-w-md" }: DrawerProps) {
  const [mounted, setMounted] = useState(false)

  // This effect ensures the drawer is mounted when open for animations
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    } else {
      const timer = setTimeout(() => {
        setMounted(false)
      }, 300) // Match this with animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end ${isOpen ? "animate-fade-in" : "opacity-0"}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition: "opacity 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${width} h-full overflow-auto ${isOpen ? "animate-slide-in-right" : "transform translate-x-full"}`}
        style={{ transition: "transform 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
} 