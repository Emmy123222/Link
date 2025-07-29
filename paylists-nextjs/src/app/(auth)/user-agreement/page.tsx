"use client"

import Link from "next/link"
import { Image } from "@/components/ui/image"
import { IoMdArrowBack } from "react-icons/io"

export default function UserAgreementPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Paylists Logo" width={150} height={40} />
          </div>
          
          <div className="mb-6">
            <Link href="/register" className="flex items-center text-gray-600 hover:text-gray-900">
              <IoMdArrowBack className="mr-2 h-4 w-4" />
              <span>Back to registration</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Agreement</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> June 21, 2024
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Paylists ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Paylists is a payment management platform that allows businesses to create, send, and manage payment requests and invoices. Our service facilitates payment processing between businesses and their customers through various payment methods.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Promptly notify us of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Acceptable Use</h2>
            <p className="mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit harmful, fraudulent, or deceptive content</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Payment Terms</h2>
            <p className="mb-4">
              Payment processing is subject to the terms and conditions of our payment service providers. You are responsible for all fees associated with your use of the Service, including transaction fees and subscription costs.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Privacy</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Paylists and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Paylists, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about this User Agreement, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@paylists.co.uk<br />
              Website: https://paylists.co.uk
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link 
                href="/privacy-policy" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Privacy Policy
              </Link>
              <Link 
                href="/register" 
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Back to Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 