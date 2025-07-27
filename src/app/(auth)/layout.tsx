"use client"

import { useApp } from '@/providers/AppProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoadingUser } = useApp()!
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoadingUser) {
      router.push("/dashboard")
    }
  }, [router, user])

  return children
}
