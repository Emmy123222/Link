'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', answer: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')

  const isFormValid = () => {
    return (
      form.name &&
      form.email &&
      form.subject &&
      form.message &&
      form.answer === '7' // math check: 3 + 4
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '', answer: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Contact Us</h2>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border px-3 py-2 rounded h-32"
        required
      />
      <div className="flex items-center gap-2">
        <label className="text-sm">What is 3 + 4?</label>
        <input
          type="text"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="w-16 border px-2 py-1 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && <p className="text-green-600">Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-600">Error sending message. Check inputs.</p>}
    </form>
  )
}