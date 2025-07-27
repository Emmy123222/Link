import { useEffect, useState } from 'react'

/**
 * Hook to detect if we're on the client side (after hydration)
 * Useful for preventing hydration mismatches when accessing browser APIs
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely access localStorage on the client side only
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const isClient = useIsClient()
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    if (isClient) {
      try {
        const stored = localStorage.getItem(key)
        if (stored !== null) {
          setValue(JSON.parse(stored))
        }
      } catch (error) {
        console.warn(`Failed to parse localStorage value for key "${key}":`, error)
      }
    }
  }, [key, isClient])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    if (isClient) {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn(`Failed to set localStorage value for key "${key}":`, error)
      }
    }
  }

  return [value, setStoredValue]
} 