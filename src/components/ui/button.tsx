import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  colorSchema?: "green" | "red" | "blue" | "yellow" | "purple" | "orange" | "pink" | "gray" | "black" | "white"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, colorSchema, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "bg-gradient-to-r hover:scale-105 active:scale-95 shadow-md",
      outline: "border-2 text-green-500 hover:bg-gray-300 hover:scale-105 active:scale-95",
      ghost: "text-green-500 hover:bg-green-50 hover:scale-105 active:scale-95",
      link: "text-green-500 underline-offset-4 hover:underline",
      secondary: "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 active:scale-95 shadow-md",
    }

    const colorSchemas = {
      green: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-green-500 hover:scale-105 active:scale-95 shadow-md",
      red: "bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 shadow-md hover:to-red-500 hover:from-red-500 active:to-red-500 active:from-red-500",
      blue: "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-md hover:to-blue-500 hover:from-blue-500 active:to-blue-500 active:from-blue-500",
      yellow: "bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 active:scale-95 shadow-md hover:to-yellow-500 hover:from-yellow-500 active:to-yellow-500 active:from-yellow-500",
      purple: "bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 active:scale-95 shadow-md hover:to-purple-500 hover:from-purple-500 active:to-purple-500 active:from-purple-500",
      orange: "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-md hover:to-orange-500 hover:from-orange-500 active:to-orange-500 active:from-orange-500",
      pink: "bg-pink-500 text-white hover:bg-pink-600 hover:scale-105 active:scale-95 shadow-md hover:to-pink-500 hover:from-pink-500 active:to-pink-500 active:from-pink-500",
      gray: "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 active:scale-95 shadow-md hover:to-gray-500 hover:from-gray-500 active:to-gray-500 active:from-gray-500",
      black: "bg-black text-white hover:bg-black-600 hover:scale-105 active:scale-95 shadow-md hover:to-black-500 hover:from-black-500 active:to-black-500 active:from-black-500",
      white: "bg-white text-black hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-md hover:to-white-500 hover:from-white-500 active:to-white-500 active:from-white-500",
    }

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant as keyof typeof variants],
          colorSchemas[colorSchema as keyof typeof colorSchemas],
          sizes[size as keyof typeof sizes],
          isLoading && "opacity-70 cursor-wait",
          className
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button } 