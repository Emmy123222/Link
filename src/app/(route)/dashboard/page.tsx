'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUserContext } from '@/hooks/useUserContext'
import { useQuickActions } from '@/hooks/useQuickActions'

export default function SimpleDashboard() {
  const { user, currentBusiness, isLoading: userLoading } = useUserContext()
  const { 
    metrics, 
    recentActivities, 
    collaborativeDocuments, 
    isLoading: dashboardLoading, 
    error 
  } = useDashboardData(currentBusiness?.id)
  const quickActions = useQuickActions(currentBusiness?.id)

  const isLoading = userLoading || dashboardLoading

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="text-center text-muted-foreground mt-8">Loading dashboard...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Unable to load dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex-1 p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Please sign in</h2>
          <p className="text-muted-foreground">You need to be logged in to view the dashboard.</p>
        </div>
      </main>
    )
  }

  if (!userLoading && !currentBusiness) {
    return (
      <main className="flex-1 p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">No Business Found</h2>
          <p className="text-muted-foreground mb-4">You need to be associated with a business to view the dashboard.</p>
          <Button onClick={() => window.location.href = '/business/setup'}>
            Set Up Business
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6 space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{currentBusiness ? `, ${currentBusiness.business_name}` : ''}!
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Action
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">To Receive</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(metrics.toReceive)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            Active receivables
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">To Pay</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(metrics.toPay)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            {metrics.overduePayments} overdue
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-foreground">{metrics.collectionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            {metrics.paidDocuments} of {metrics.totalDocuments} paid
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Documents</p>
              <p className="text-2xl font-bold text-foreground">{metrics.activeDocuments}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400">
            <Users className="h-4 w-4 mr-1" />
            {collaborativeDocuments.length} collaborative
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="p-2 bg-muted rounded-full">
                    {activity.type === 'invoice_sent' && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'payment_received' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'document_edited' && <FileText className="h-4 w-4 text-orange-500" />}
                    {activity.type === 'payment_request_created' && <Plus className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      {activity.amount && (
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Collaborative Documents */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Collaborative Documents</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-4">
            {collaborativeDocuments.length > 0 ? (
              collaborativeDocuments.map((doc, index) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="p-2 bg-muted rounded-full">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{doc.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {doc.collaboratorCount}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Last edited by {doc.lastEditor}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.lastEditTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted" />
                <p>No collaborative documents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={quickActions.createInvoice}
            disabled={!currentBusiness}
          >
            <Plus className="h-6 w-6" />
            Create Invoice
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={quickActions.createPaymentRequest}
            disabled={!currentBusiness}
          >
            <FileText className="h-6 w-6" />
            Payment Request
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={quickActions.inviteCollaborator}
            disabled={!currentBusiness}
          >
            <Users className="h-6 w-6" />
            Invite Collaborator
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={quickActions.recordPayment}
            disabled={!currentBusiness}
          >
            <DollarSign className="h-6 w-6" />
            Record Payment
          </Button>
        </div>
      </div>
    </main>
  )
}
