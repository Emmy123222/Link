"use client"

import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from '@supabase/supabase-js'
import { toast } from "react-toastify"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(1, { message: "Feedback is required" }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

interface ContactDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState('')

  // This effect ensures the drawer is mounted when open for animations
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    } else {
      const timer = setTimeout(() => {
        setMounted(false)
      }, 300) // Match this with animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)

    try {
      
      const { error } = await supabase.from('contacts_form').insert(data)
      // console.log(data)

      if (error) {
      setStatus('Error sending message. Please try again.')
    } else {
      toast.success('Message sent successfully!')
      setStatus('')
      // Reset form after successful submission
      reset()
      onClose()
    }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end ${isOpen ? "animate-fade-in" : "opacity-0"}`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transition: "opacity 0.3s ease-out",
      }}
    >
      <div
        className={`bg-white w-full max-w-md h-full overflow-auto ${isOpen ? "animate-slide-in-right" : "transform translate-x-full"}`}
        style={{ transition: "transform 0.3s ease-out" }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact us</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close">
              <FiX size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-8">Thank you for reaching out! Your feedback is much appreciated!</p>

          <div className="bg-white rounded-lg">
            <h3 className="text-lg font-medium mb-4">Contact form</h3>
            <p className="text-gray-600 mb-4">Please fill in the following form:</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name*
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Your email"
                  {...register("email")}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Please select a subject from the list:
                </label>
                <select
                  id="subject"
                  className={`w-full px-3 py-2 border ${errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  {...register("subject")}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Product Feedback</option>
                </select>
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium mb-1">
                  Feedback*
                </label>
                <textarea
                  id="feedback"
                  rows={5}
                  className={`w-full px-3 py-2 border ${errors.message ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Your feedback"
                  {...register("message")}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
