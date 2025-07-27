import * as React from 'react'
import { useResponsive, BreakpointValue } from './use-responsive'

export interface FetchConfig<T> {
  data: T
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useResponsiveFetch<T>(
  fetchFn: (config: { limit: number; offset: number }) => Promise<T[]>,
  config?: Partial<BreakpointValue<{ limit: number }>>
): FetchConfig<T[]> {
  const [data, setData] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [offset, setOffset] = React.useState(0)

  const limit = useResponsive(
    {
      xs: config?.xs?.limit ?? 5,
      sm: config?.sm?.limit ?? 10,
      md: config?.md?.limit ?? 15,
      lg: config?.lg?.limit ?? 20,
      xl: config?.xl?.limit ?? 25,
      '2xl': config?.['2xl']?.limit ?? 30,
    },
    10
  )

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchFn({ limit, offset })
      setData(prev => [...prev, ...result])
      setOffset(prev => prev + result.length)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [fetchFn, limit, offset])

  const refetch = React.useCallback(async () => {
    setData([])
    setOffset(0)
    await fetchData()
  }, [fetchData])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Example usage:
// const { data, loading, error, refetch } = useResponsiveFetch(
//   async ({ limit, offset }) => {
//     const response = await fetch(`/api/items?limit=${limit}&offset=${offset}`)
//     return response.json()
//   },
//   {
//     xs: { limit: 5 },
//     sm: { limit: 10 },
//     md: { limit: 15 },
//     lg: { limit: 20 },
//     xl: { limit: 25 },
//     '2xl': { limit: 30 },
//   }
// ) 