"use client"

import { createContext, useContext, useEffect, useState, type JSX } from 'react'
import type {
  LoginForm,
  RegisterForm,
} from '@/types/auth'
import type { User } from '@/types/user'
import { afterSignUp, createAccount, logout, sendVerifyEmail, signIn, } from '@/lib/supabase/auth'
import type { Business } from '@/types/business'
import { useCurrentUser } from '@/hooks/use-user'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ApiResponse, handleApiCall } from '@/lib/utils/api'
export interface IApp {
  user: User | null
  currentBusiness: Business | null
  businesses: Business[]
  setBusinesses: (businesses: Business[]) => void
  setCurrentBusiness: (business: Business | null) => void
  setUser: (user: User | null) => void
  login: (loginData: LoginForm) => Promise<ApiResponse<any>>
  register: (registerData: RegisterForm) => Promise<ApiResponse<any>>
  isLoadingUser: boolean
  logout: () => void
  resendEmail: (email: string) => Promise<void>
}

const AppContext = createContext<IApp | null>(null)
interface Props {
  children: React.ReactNode
}

export const AppProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    const fetchBusinessList = async () => {
      if (currentUser && !isLoadingUser) {
        setUser(currentUser)
      }
    }
    fetchBusinessList()
  }, [currentUser])

  const login = async (loginData: LoginForm) => await handleApiCall(
    async () => await signIn(loginData.email, loginData.password),
    {
      errorMessage: 'Login failed',
      loadingMessage: 'Logging in...',
      successMessage: 'Logged in successfully',
    }
  )

  const register = async (registerData: RegisterForm) => {
    return handleApiCall(
      async () => {
        const response = await createAccount(registerData.email, registerData.password)
        await afterSignUp({ id: response?.user?.id, email: response?.user?.email })
        return await sendVerifyEmail({ userEmail: response?.user?.email })
      },
      {
        loadingMessage: 'Registering user in progress...',
        successMessage: 'User registered successfully',
        errorMessage: 'Registration failed'
      }
    )
  }

  const resendEmail = async (email: string) => {
    handleApiCall(
      async () => {
        await sendVerifyEmail({ userEmail: email })
      },
      {
        loadingMessage: 'Resending email...',
        successMessage: 'Email resent successfully',
        errorMessage: 'Email resend failed'
      }
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      // Only access localStorage on client-side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentBusiness')
      }
      setCurrentBusiness(null)
      queryClient.clear()
      router.push("/login")
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        currentBusiness,
        businesses,
        setBusinesses,
        setCurrentBusiness,
        setUser,
        login,
        register,
        logout: handleLogout,
        isLoadingUser,
        resendEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
