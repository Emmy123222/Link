"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

const MenuContext = createContext<{ close: () => void } | null>(null)

export function Menu({ button, children }: { button: React.ReactNode; children: React.ReactNode }) {
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
      <div className="relative inline-block text-left" ref={ref}>
        <div onClick={() => setOpen(prev => !prev)}>{button}</div>
        {open && <MenuList>{children}</MenuList>}
      </div>
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) throw new Error("useMenu must be used within <Menu>")
  return context
}


export function MenuList({ children }: { children: React.ReactNode }) {

  return (
    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="py-1 max-h-[200px] overflow-y-auto">{children}</div>
    </div>
  )
}

export function MenuItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const { close } = useMenu()
  return (
    <div
      onClick={() => {
        onClick?.()
        close()
      }}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100 truncate max-w-[200px]"
    >
      {children}
    </div>
  )
}

export function MenuButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  return (
    <div
      className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50" onClick={onClick}
    >
      {children}
    </div>
  )
}
