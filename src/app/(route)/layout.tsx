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
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        {children}
      </div>
    </div>
  )
}
