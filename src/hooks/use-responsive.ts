import * as React from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type BreakpointValue<T> = Partial<Record<Breakpoint, T>>

export function useResponsive<T>(values: BreakpointValue<T>, defaultValue: T): T {
  const [value, setValue] = React.useState<T>(defaultValue)

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const updateValue = () => {
      const width = window.innerWidth
      let currentValue = defaultValue

      // Find the largest breakpoint that matches
      Object.entries(breakpoints)
        .reverse()
        .forEach(([key, breakpoint]) => {
          if (width >= breakpoint && values[key as Breakpoint]) {
            currentValue = values[key as Breakpoint]!
          }
        })

      setValue(currentValue)
    }

    // Initial update
    updateValue()

    // Add resize listener
    window.addEventListener('resize', updateValue)

    // Cleanup
    return () => window.removeEventListener('resize', updateValue)
  }, [values, defaultValue])

  return value
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>('xs')

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const updateBreakpoint = () => {
      const width = window.innerWidth
      let currentBreakpoint: Breakpoint = 'xs'

      Object.entries(breakpoints)
        .reverse()
        .forEach(([key, value]) => {
          if (width >= value) {
            currentBreakpoint = key as Breakpoint
          }
        })

      setBreakpoint(currentBreakpoint)
    }

    // Initial update
    updateBreakpoint()

    // Add resize listener
    window.addEventListener('resize', updateBreakpoint)

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

export function useIsMobile() {
  const breakpoint = useBreakpoint()
  return breakpoint === 'xs' || breakpoint === 'sm'
}

export function useIsTablet() {
  const breakpoint = useBreakpoint()
  return breakpoint === 'md'
}

export function useIsDesktop() {
  const breakpoint = useBreakpoint()
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
}

// Example usage:
// const columns = useResponsive({
//   xs: 1,
//   sm: 2,
//   md: 3,
//   lg: 4,
//   xl: 5,
//   '2xl': 6,
// }, 1) 