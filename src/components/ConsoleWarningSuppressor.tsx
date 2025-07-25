"use client"

import { useEffect } from 'react'

export function ConsoleWarningSuppressor() {
  useEffect(() => {
    // Suppress fullscreen violations in console
    const originalWarn = console.warn
    console.warn = function (...args) {
      const message = args[0]
      if (typeof message === 'string' && message.includes('fullscreen')) {
        return // Suppress fullscreen warnings
      }
      originalWarn.apply(console, args)
    }

    // Cleanup function to restore original console.warn
    return () => {
      console.warn = originalWarn
    }
  }, [])

  return null
} 