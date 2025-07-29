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

export default function SimpleDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

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

  return (
    <main className="flex-1 p-6 space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
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
                {formatCurrency(15750)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">To Pay</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(3200)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            1 overdue
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-foreground">85.5%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            Good performance
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Documents</p>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400">
            <Users className="h-4 w-4 mr-1" />
            3 collaborative
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
            {[
              {
                title: 'Invoice sent',
                description: 'Invoice #INV-001 sent to client@example.com',
                time: '30 minutes ago',
                icon: <FileText className="h-4 w-4 text-blue-500" />,
                amount: '$1,500'
              },
              {
                title: 'Payment received',
                description: 'Payment received for Invoice #INV-002',
                time: '2 hours ago', 
                icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                amount: '$750'
              },
              {
                title: 'Document edited',
                description: 'Invoice #INV-003 was updated',
                time: '4 hours ago',
                icon: <FileText className="h-4 w-4 text-orange-500" />
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="p-2 bg-muted rounded-full">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    {activity.amount && (
                      <span className="text-sm font-medium text-foreground">{activity.amount}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
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
            {[
              {
                title: 'Invoice INV-001',
                lastEditor: 'Sarah Johnson',
                time: '1 hour ago',
                collaborators: 2,
                type: 'invoice'
              },
              {
                title: 'Payment Request PR-005',
                lastEditor: 'Mike Chen',
                time: '3 hours ago',
                collaborators: 1,
                type: 'payment_request'
              },
              {
                title: 'Invoice INV-007',
                lastEditor: 'Alex Kim',
                time: '5 hours ago',
                collaborators: 3,
                type: 'invoice'
              }
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="p-2 bg-muted rounded-full">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{doc.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {doc.collaborators}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Last edited by {doc.lastEditor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Plus className="h-6 w-6" />
            Create Invoice
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <FileText className="h-6 w-6" />
            Payment Request
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            Invite Collaborator
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Record Payment
          </Button>
        </div>
      </div>
    </main>
  )
}
