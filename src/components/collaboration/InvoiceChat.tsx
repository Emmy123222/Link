'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, Paperclip, FileText, X } from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  user_id: string
  created_at: string
  user: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
  attachments?: ChatAttachment[]
}

interface ChatAttachment {
  id: string
  filename: string
  file_size: number
  mime_type: string
  storage_path: string
}

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface InvoiceChatProps {
  invoiceId: string
  currentUser: User
}

const getUserDisplayName = (user: User) => {
  return user.full_name || user.email || 'Unknown User'
}

export default function InvoiceChat({ invoiceId, currentUser }: InvoiceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Discussion started for this invoice. Please review the details and let me know if you have any questions.',
      user_id: 'user1',
      created_at: new Date().toISOString(),
      user: {
        id: 'user1',
        email: 'collaborator@example.com',
        full_name: 'John Collaborator',
        avatar_url: null
      }
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Add message to local state (mock implementation)
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
      user: currentUser,
      attachments: attachments.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: `mock-path/${file.name}`
      }))
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
    setAttachments([])
    setIsLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Invoice Discussion</h3>
        <p className="text-sm text-gray-500">Collaborate on invoice #{invoiceId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {getUserDisplayName(message.user).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {getUserDisplayName(message.user)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                
                {message.content && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                    {message.content}
                  </div>
                )}

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">
                          {attachment.filename}
                        </span>
                        <span className="text-xs text-blue-500">
                          ({formatFileSize(attachment.file_size)})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-2 py-1 rounded border"
              >
                <FileText className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-24 resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}