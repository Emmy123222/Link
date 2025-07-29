import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface DashboardMetrics {
  toReceive: number
  toPay: number
  collectionRate: number
  activeDocuments: number
  totalDocuments: number
  paidDocuments: number
  overduePayments: number
}

export interface RecentActivity {
  id: string
  type: 'invoice_sent' | 'payment_received' | 'document_edited' | 'payment_request_created'
  title: string
  description: string
  amount?: number
  time: string
  documentId?: string
  documentNumber?: string
}

export interface CollaborativeDocument {
  id: string
  title: string
  documentNumber: string
  type: 'invoice' | 'payment_request'
  lastEditor: string
  lastEditTime: string
  collaboratorCount: number
  status: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  recentActivities: RecentActivity[]
  collaborativeDocuments: CollaborativeDocument[]
  isLoading: boolean
  error: string | null
}

export const useDashboardData = (businessId?: number) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    metrics: {
      toReceive: 0,
      toPay: 0,
      collectionRate: 0,
      activeDocuments: 0,
      totalDocuments: 0,
      paidDocuments: 0,
      overduePayments: 0
    },
    recentActivities: [],
    collaborativeDocuments: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!businessId) {
          // Don't set error, just keep loading state until businessId is available
          setDashboardData(prev => ({ ...prev, isLoading: true, error: null }))
          return
        }

        setDashboardData(prev => ({ ...prev, isLoading: true, error: null }))

        // Fetch all data in parallel
        const [metrics, activities, documents] = await Promise.all([
          fetchMetrics(businessId),
          fetchRecentActivities(businessId),
          fetchCollaborativeDocuments(businessId)
        ])

        setDashboardData({
          metrics,
          recentActivities: activities,
          collaborativeDocuments: documents,
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load dashboard data'
        }))
      }
    }

    fetchDashboardData()
  }, [businessId])

  return dashboardData
}

// Fetch financial metrics
const fetchMetrics = async (businessId: number): Promise<DashboardMetrics> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Fetch documents where business is vendor (money to receive)
  const { data: receivableDocuments, error: receivableError } = await supabase
    .from('Document_header')
    .select('amount, paid_amount, status, due_date')
    .eq('vendor_id', businessId)
    .in('status', ['Open', 'Delayed', 'Late payment'])

  if (receivableError) throw receivableError

  // Fetch documents where business is customer (money to pay)
  const { data: payableDocuments, error: payableError } = await supabase
    .from('Document_header')
    .select('amount, paid_amount, status, due_date')
    .eq('customer_id', businessId)
    .in('status', ['Open', 'Delayed', 'Late payment'])

  if (payableError) throw payableError

  // Fetch all documents for totals
  const { data: allVendorDocs, error: allVendorError } = await supabase
    .from('Document_header')
    .select('status')
    .eq('vendor_id', businessId)

  if (allVendorError) throw allVendorError

  // Calculate metrics
  const toReceive = receivableDocuments?.reduce((sum, doc) => {
    return sum + ((doc.amount || 0) - (doc.paid_amount || 0))
  }, 0) || 0

  const toPay = payableDocuments?.reduce((sum, doc) => {
    return sum + ((doc.amount || 0) - (doc.paid_amount || 0))
  }, 0) || 0

  const totalDocuments = allVendorDocs?.length || 0
  const paidDocuments = allVendorDocs?.filter(doc => 
    doc.status === 'Paid'
  ).length || 0
  const collectionRate = totalDocuments > 0 ? (paidDocuments / totalDocuments) * 100 : 0

  const activeDocuments = (receivableDocuments?.length || 0) + (payableDocuments?.length || 0)

  // Count overdue payments
  const today = new Date()
  const overduePayments = receivableDocuments?.filter(doc => 
    doc.due_date && new Date(doc.due_date) < today
  ).length || 0

  return {
    toReceive,
    toPay,
    collectionRate,
    activeDocuments,
    totalDocuments,
    paidDocuments,
    overduePayments
  }
}

// Fetch recent activities
const fetchRecentActivities = async (businessId: number): Promise<RecentActivity[]> => {
  // Get recent documents and transactions
  const { data: recentDocs, error: docsError } = await supabase
    .from('Document_header')
    .select(`
      id,
      document_number,
      document_type,
      amount,
      status,
      created_at
    `)
    .or(`vendor_id.eq.${businessId},customer_id.eq.${businessId}`)
    .order('created_at', { ascending: false })
    .limit(10)

  if (docsError) throw docsError

  // Get recent transactions using correct table name
  const { data: recentTransactions, error: transError } = await supabase
    .from('Document transactions')
    .select(`
      id,
      amount,
      status,
      created_at,
      header_id
    `)
    .eq('status', 'SUCCESSFUL')
    .order('created_at', { ascending: false })
    .limit(5)

  if (transError) {
    console.warn('Could not fetch transactions:', transError.message)
    // Continue without transactions data
  }

  const activities: RecentActivity[] = []

  // Process document activities
  recentDocs?.forEach(doc => {
    const timeAgo = formatTimeAgo(new Date(doc.created_at))

    if (doc.status === 'Open') {
      activities.push({
        id: `doc-${doc.id}`,
        type: 'invoice_sent',
        title: 'Document sent',
        description: `${doc.document_type} ${doc.document_number}`,
        amount: doc.amount || undefined,
        time: timeAgo,
        documentId: doc.id.toString(),
        documentNumber: doc.document_number || undefined
      })
    }
  })

  // Process transaction activities if available
  recentTransactions?.forEach(trans => {
    activities.push({
      id: `trans-${trans.id}`,
      type: 'payment_received',
      title: 'Payment received',
      description: `Payment processed successfully`,
      amount: trans.amount || undefined,
      time: formatTimeAgo(new Date(trans.created_at)),
      documentId: trans.header_id?.toString()
    })
  })

  // Sort all activities by time and return top 6
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6)
}

// Fetch collaborative documents
const fetchCollaborativeDocuments = async (businessId: number): Promise<CollaborativeDocument[]> => {
  // Get documents with recent edits (if columns exist) or fallback to recent documents
  const { data: docs, error } = await supabase
    .from('Document_header')
    .select(`
      id,
      document_number,
      document_type,
      status,
      created_at,
      vendor_id,
      customer_id
    `)
    .or(`vendor_id.eq.${businessId},customer_id.eq.${businessId}`)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.warn('Could not fetch collaborative documents:', error.message)
    return []
  }

  return docs?.map(doc => ({
    id: doc.id.toString(),
    title: `${doc.document_type} ${doc.document_number}`,
    documentNumber: doc.document_number || 'N/A',
    type: doc.document_type?.toLowerCase().includes('invoice') ? 'invoice' : 'payment_request',
    lastEditor: 'System User', // Fallback since we don't have user join
    lastEditTime: formatTimeAgo(new Date(doc.created_at)),
    collaboratorCount: Math.floor(Math.random() * 3) + 1, // Mock for now
    status: doc.status || 'Draft'
  })) || []
}

// Utility function to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString()
}
