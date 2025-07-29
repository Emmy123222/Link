'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Users, 
  Clock, 
  Edit3, 
  Eye, 
  MessageCircle,
  History,
  UserCheck
} from 'lucide-react'

interface CollaborativeEditingPanelProps {
  documentId: string
  documentType: 'invoice' | 'payment-request'
  currentUserId: string
}

interface EditingUser {
  id: string
  name: string
  email: string
  avatar_url?: string
}

interface EditHistory {
  id: string
  action: string
  user: EditingUser
  timestamp: string
}

export default function CollaborativeEditingPanel({ 
  documentId, 
  documentType, 
  currentUserId 
}: CollaborativeEditingPanelProps) {
  const [lastEditedBy, setLastEditedBy] = useState<EditingUser | null>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com'
  })
  const [lastEditedAt, setLastEditedAt] = useState<string | null>(
    new Date(Date.now() - 300000).toISOString() // 5 minutes ago
  )
  const [activeEditors, setActiveEditors] = useState<EditingUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    {
      id: '2', 
      name: 'Mike Chen',
      email: 'mike@example.com'
    }
  ])
  const [editHistory, setEditHistory] = useState<EditHistory[]>([
    {
      id: '1',
      action: 'Updated invoice amount',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com'
      },
      timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
    },
    {
      id: '2',
      action: 'Added payment terms',
      user: {
        id: '2',
        name: 'Mike Chen', 
        email: 'mike@example.com'
      },
      timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
    },
    {
      id: '3',
      action: 'Modified line items',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com'
      },
      timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
    }
  ])

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Collaboration</h3>
      </div>

      {/* Active Editors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Currently Editing ({activeEditors.length})
        </h4>
        
        {activeEditors.length === 0 ? (
          <p className="text-sm text-gray-500">No one is currently editing this document</p>
        ) : (
          <div className="space-y-2">
            {activeEditors.map((editor) => (
              <div key={editor.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-700">
                    {editor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{editor.name}</p>
                  <p className="text-xs text-gray-500">{editor.email}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Edited Info */}
      {lastEditedBy && lastEditedAt && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Last Modified</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {lastEditedBy.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-900">{lastEditedBy.name}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(lastEditedAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit History */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Changes
        </h4>
        
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {editHistory.map((edit) => (
            <div key={edit.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-gray-600">
                  {edit.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{edit.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{edit.user.name}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(edit.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <MessageCircle className="w-4 h-4 mr-2" />
          Open Discussion
        </Button>
        
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Eye className="w-4 h-4 mr-2" />
          View Full History
        </Button>
        
        <Button variant="outline" size="sm" className="w-full justify-start">
          <UserCheck className="w-4 h-4 mr-2" />
          Manage Permissions
        </Button>
      </div>
    </div>
  )
}
