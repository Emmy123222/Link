import * as React from 'react'
import { useResponsive, BreakpointValue } from './use-responsive'

export interface LayoutConfig {
  columns: number
  gap: number
  padding: number
  maxWidth: number
}

const defaultLayout: LayoutConfig = {
  columns: 1,
  gap: 16,
  padding: 16,
  maxWidth: 1200,
}

export function useLayout(config?: Partial<BreakpointValue<Partial<LayoutConfig>>>) {
  const columns = useResponsive(
    {
      xs: config?.xs?.columns ?? 1,
      sm: config?.sm?.columns ?? 2,
      md: config?.md?.columns ?? 3,
      lg: config?.lg?.columns ?? 4,
      xl: config?.xl?.columns ?? 5,
      '2xl': config?.['2xl']?.columns ?? 6,
    },
    defaultLayout.columns
  )

  const gap = useResponsive(
    {
      xs: config?.xs?.gap ?? 8,
      sm: config?.sm?.gap ?? 12,
      md: config?.md?.gap ?? 16,
      lg: config?.lg?.gap ?? 20,
      xl: config?.xl?.gap ?? 24,
      '2xl': config?.['2xl']?.gap ?? 32,
    },
    defaultLayout.gap
  )

  const padding = useResponsive(
    {
      xs: config?.xs?.padding ?? 16,
      sm: config?.sm?.padding ?? 20,
      md: config?.md?.padding ?? 24,
      lg: config?.lg?.padding ?? 32,
      xl: config?.xl?.padding ?? 40,
      '2xl': config?.['2xl']?.padding ?? 48,
    },
    defaultLayout.padding
  )

  const maxWidth = useResponsive(
    {
      xs: config?.xs?.maxWidth ?? 640,
      sm: config?.sm?.maxWidth ?? 768,
      md: config?.md?.maxWidth ?? 1024,
      lg: config?.lg?.maxWidth ?? 1280,
      xl: config?.xl?.maxWidth ?? 1536,
      '2xl': config?.['2xl']?.maxWidth ?? 1920,
    },
    defaultLayout.maxWidth
  )

  return {
    columns,
    gap,
    padding,
    maxWidth,
    // Helper functions
    getGridTemplateColumns: () => `repeat(${columns}, minmax(0, 1fr))`,
    getGap: () => `${gap}px`,
    getPadding: () => `${padding}px`,
    getMaxWidth: () => `${maxWidth}px`,
  }
}

// Example usage:
// const layout = useLayout({
//   xs: { columns: 1, gap: 8 },
//   sm: { columns: 2, gap: 12 },
//   md: { columns: 3, gap: 16 },
//   lg: { columns: 4, gap: 20 },
//   xl: { columns: 5, gap: 24 },
//   '2xl': { columns: 6, gap: 32 },
// }) 