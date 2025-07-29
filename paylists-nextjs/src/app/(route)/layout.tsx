"use client"

import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useCurrentUser } from '@/hooks/use-user'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const { data: user, isPending: isLoadingUser } = useCurrentUser()

  useEffect(() => {
    if (!user && !isLoadingUser) {
      redirect("/login")
    }
  }, [user])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4"></div>
          <span className="text-lg text-muted-foreground">Loading your account...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content - Add padding to account for fixed sidebar */}
      <div className="pl-16 sm:pl-64 h-full">
        <div className="flex flex-col h-full bg-background">
          {/* Navbar */}
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  )
}
