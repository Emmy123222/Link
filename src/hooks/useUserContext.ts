import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface UserContext {
  user: any
  currentBusiness: any
  businesses: any[]
  isLoading: boolean
  error: string | null
}

export const useUserContext = () => {
  const [userContext, setUserContext] = useState<UserContext>({
    user: null,
    currentBusiness: null,
    businesses: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserContext(prev => ({ ...prev, isLoading: true, error: null }))

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        console.log('Current user:', user)
        if (userError) throw userError
        if (!user) {
          setUserContext({
            user: null,
            currentBusiness: null,
            businesses: [],
            isLoading: false,
            error: null
          })
          return
        }

        // Get user's businesses through User-Business relationship
        console.log('Fetching businesses for user:', user.id)
        
        // First, check if user exists in Users table
        const { data: userRecord, error: userRecordError } = await supabase
          .from('Users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        console.log('User record check:', { userRecord, userRecordError })
        
        // If user doesn't exist in Users table, create them
        if (!userRecord && !userRecordError) {
          const { data: newUser, error: createError } = await supabase
            .from('Users')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              guest_user: false
            })
            .select()
          
          console.log('Created new user:', { newUser, createError })
          if (createError) {
            console.error('Failed to create user:', createError)
            // Don't throw error, continue with empty businesses
          }
        }
        
        const { data: userBusinesses, error: businessError } = await supabase
          .from('User - Business')
          .select(`
            business,
            active,
            Businesses!inner(
              id,
              business_name,
              email,
              business_type,
              ownerId,
              active
            )
          `)
          .eq('id', user.id)
          .eq('active', true)

        console.log('User businesses query result:', { userBusinesses, businessError })
        if (businessError) {
          console.error('Business query error:', businessError)
          // Don't throw error for business query - user might not have businesses yet
          // Set context with empty businesses instead
          setUserContext({
            user,
            currentBusiness: null,
            businesses: [],
            isLoading: false,
            error: null
          })
          return
        }

        const businesses = userBusinesses?.map(ub => ub.Businesses) || []
        const currentBusiness = businesses[0] || null

        console.log('Final user context:', { 
          userId: user.id, 
          businessCount: businesses.length, 
          currentBusinessId: currentBusiness?.id 
        })

        setUserContext({
          user,
          currentBusiness,
          businesses,
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching user context:', error)
        setUserContext(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load user data'
        }))
      }
    }

    fetchUserData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchUserData()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return userContext
}
