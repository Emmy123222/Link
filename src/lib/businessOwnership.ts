import { supabase } from './supabaseClient'

export interface BusinessOwnership {
  id: string
  user_id: string
  business_id: string
  ownership_type: 'owner' | 'admin' | 'editor' | 'viewer'
  granted_at: string
  granted_by: string
  revoked_at?: string
  revoked_by?: string
}

export interface BusinessOwnershipHistory {
  id: string
  user_id: string
  business_id: string
  action: 'granted' | 'revoked' | 'modified'
  ownership_type: 'owner' | 'admin' | 'editor' | 'viewer'
  previous_ownership_type?: string
  performed_by: string
  performed_at: string
  reason?: string
}

export class BusinessOwnershipManager {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  /**
   * Grant business ownership to a user
   */
  async grantOwnership(
    userId: string,
    businessId: string,
    ownershipType: 'owner' | 'admin' | 'editor' | 'viewer',
    grantedBy: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string; ownership?: BusinessOwnership }> {
    try {
      // Check if ownership already exists
      const { data: existingOwnership } = await this.supabase
        .from('Business_ownership')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .is('revoked_at', null)
        .single()

      if (existingOwnership) {
        return {
          success: false,
          error: 'User already has ownership of this business'
        }
      }

      // Create new ownership record
      const { data: ownership, error: ownershipError } = await this.supabase
        .from('Business_ownership')
        .insert({
          user_id: userId,
          business_id: businessId,
          ownership_type: ownershipType,
          granted_by: grantedBy,
          granted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (ownershipError) {
        throw ownershipError
      }

      // Log the action in history
      await this.logOwnershipHistory({
        user_id: userId,
        business_id: businessId,
        action: 'granted',
        ownership_type: ownershipType,
        performed_by: grantedBy,
        reason: reason || 'Business ownership granted'
      })

      return {
        success: true,
        ownership
      }
    } catch (error) {
      console.error('Error granting ownership:', error)
      return {
        success: false,
        error: 'Failed to grant business ownership'
      }
    }
  }

  /**
   * Revoke business ownership from a user
   */
  async revokeOwnership(
    userId: string,
    businessId: string,
    revokedBy: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current ownership
      const { data: currentOwnership } = await this.supabase
        .from('Business_ownership')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .is('revoked_at', null)
        .single()

      if (!currentOwnership) {
        return {
          success: false,
          error: 'No active ownership found for this user and business'
        }
      }

      // Revoke ownership
      const { error: revokeError } = await this.supabase
        .from('Business_ownership')
        .update({
          revoked_at: new Date().toISOString(),
          revoked_by: revokedBy,
        })
        .eq('id', currentOwnership.id)

      if (revokeError) {
        throw revokeError
      }

      // Log the action in history
      await this.logOwnershipHistory({
        user_id: userId,
        business_id: businessId,
        action: 'revoked',
        ownership_type: currentOwnership.ownership_type,
        performed_by: revokedBy,
        reason: reason || 'Business ownership revoked'
      })

      return { success: true }
    } catch (error) {
      console.error('Error revoking ownership:', error)
      return {
        success: false,
        error: 'Failed to revoke business ownership'
      }
    }
  }

  /**
   * Modify ownership type
   */
  async modifyOwnership(
    userId: string,
    businessId: string,
    newOwnershipType: 'owner' | 'admin' | 'editor' | 'viewer',
    modifiedBy: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current ownership
      const { data: currentOwnership } = await this.supabase
        .from('Business_ownership')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .is('revoked_at', null)
        .single()

      if (!currentOwnership) {
        return {
          success: false,
          error: 'No active ownership found for this user and business'
        }
      }

      const previousType = currentOwnership.ownership_type

      // Update ownership type
      const { error: updateError } = await this.supabase
        .from('Business_ownership')
        .update({
          ownership_type: newOwnershipType,
        })
        .eq('id', currentOwnership.id)

      if (updateError) {
        throw updateError
      }

      // Log the action in history
      await this.logOwnershipHistory({
        user_id: userId,
        business_id: businessId,
        action: 'modified',
        ownership_type: newOwnershipType,
        previous_ownership_type: previousType,
        performed_by: modifiedBy,
        reason: reason || `Ownership changed from ${previousType} to ${newOwnershipType}`
      })

      return { success: true }
    } catch (error) {
      console.error('Error modifying ownership:', error)
      return {
        success: false,
        error: 'Failed to modify business ownership'
      }
    }
  }

  /**
   * Get user's businesses with ownership details
   */
  async getUserBusinesses(userId: string): Promise<{
    success: boolean
    businesses?: Array<{
      business: any
      ownership: BusinessOwnership
    }>
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('Business_ownership')
        .select(`
          *,
          business:Business(*)
        `)
        .eq('user_id', userId)
        .is('revoked_at', null)

      if (error) {
        throw error
      }

      return {
        success: true,
        businesses: data.map((item: any) => ({
          business: item.business,
          ownership: {
            id: item.id,
            user_id: item.user_id,
            business_id: item.business_id,
            ownership_type: item.ownership_type,
            granted_at: item.granted_at,
            granted_by: item.granted_by,
            revoked_at: item.revoked_at,
            revoked_by: item.revoked_by,
          }
        }))
      }
    } catch (error) {
      console.error('Error getting user businesses:', error)
      return {
        success: false,
        error: 'Failed to retrieve user businesses'
      }
    }
  }

  /**
   * Get business owners and their permissions
   */
  async getBusinessOwners(businessId: string): Promise<{
    success: boolean
    owners?: Array<{
      user: any
      ownership: BusinessOwnership
    }>
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('Business_ownership')
        .select(`
          *,
          user:Users(id, email, first_name, last_name, is_guest)
        `)
        .eq('business_id', businessId)
        .is('revoked_at', null)

      if (error) {
        throw error
      }

      return {
        success: true,
        owners: data.map((item: any) => ({
          user: item.user,
          ownership: {
            id: item.id,
            user_id: item.user_id,
            business_id: item.business_id,
            ownership_type: item.ownership_type,
            granted_at: item.granted_at,
            granted_by: item.granted_by,
            revoked_at: item.revoked_at,
            revoked_by: item.revoked_by,
          }
        }))
      }
    } catch (error) {
      console.error('Error getting business owners:', error)
      return {
        success: false,
        error: 'Failed to retrieve business owners'
      }
    }
  }

  /**
   * Check if user has specific permission for a business
   */
  async hasPermission(
    userId: string,
    businessId: string,
    requiredPermission: 'owner' | 'admin' | 'editor' | 'viewer'
  ): Promise<boolean> {
    try {
      const { data: ownership } = await this.supabase
        .from('Business_ownership')
        .select('ownership_type')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .is('revoked_at', null)
        .single()

      if (!ownership) {
        return false
      }

      // Define permission hierarchy
      const permissionLevels = {
        'viewer': 1,
        'editor': 2,
        'admin': 3,
        'owner': 4
      }

      const userLevel = permissionLevels[ownership.ownership_type as keyof typeof permissionLevels]
      const requiredLevel = permissionLevels[requiredPermission]

      return userLevel >= requiredLevel
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  /**
   * Log ownership history
   */
  private async logOwnershipHistory(historyData: {
    user_id: string
    business_id: string
    action: 'granted' | 'revoked' | 'modified'
    ownership_type: 'owner' | 'admin' | 'editor' | 'viewer'
    previous_ownership_type?: string
    performed_by: string
    reason?: string
  }): Promise<void> {
    try {
      await this.supabase
        .from('Business_ownership_history')
        .insert({
          ...historyData,
          performed_at: new Date().toISOString(),
        })
    } catch (error) {
      console.error('Error logging ownership history:', error)
      // Don't throw here as it's not critical to the main operation
    }
  }

  /**
   * Get ownership history for a business
   */
  async getOwnershipHistory(businessId: string): Promise<{
    success: boolean
    history?: BusinessOwnershipHistory[]
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('Business_ownership_history')
        .select(`
          *,
          user:Users!Business_ownership_history_user_id_fkey(email, first_name, last_name),
          performed_by_user:Users!Business_ownership_history_performed_by_fkey(email, first_name, last_name)
        `)
        .eq('business_id', businessId)
        .order('performed_at', { ascending: false })

      if (error) {
        throw error
      }

      return {
        success: true,
        history: data
      }
    } catch (error) {
      console.error('Error getting ownership history:', error)
      return {
        success: false,
        error: 'Failed to retrieve ownership history'
      }
    }
  }
}
