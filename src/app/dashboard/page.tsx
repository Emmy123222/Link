'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/context/authcontext"

const page = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      Welcome Back <span className='font-bold'>{user.email}</span><br/>
      <button
        onClick={handleLogout}
        className="ml-4 bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default page