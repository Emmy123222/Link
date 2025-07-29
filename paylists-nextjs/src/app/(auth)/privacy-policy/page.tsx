"use client"

import Link from "next/link"
import { Image } from "@/components/ui/image"
import { IoMdArrowBack } from "react-icons/io"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> June 21, 2024
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Paylists ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our payment management platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you provide directly to us, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information (email, phone number, address)</li>
              <li>Business information (company name, registration number, VAT number)</li>
              <li>Payment information (bank account details, payment preferences)</li>
              <li>Account credentials (username, password)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Usage Information</h3>
            <p className="mb-4">
              We automatically collect certain information about your use of our service:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Transaction information (payment amounts, dates, status)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our payment management services</li>
              <li>Process payments and transactions</li>
              <li>Communicate with you about your account and our services</li>
              <li>Improve and optimize our platform</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Information Sharing</h2>
            <p className="mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Payment Processors:</strong> We share payment information with trusted payment service providers to process transactions</li>
              <li><strong>Service Providers:</strong> We may share information with third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> Information may be transferred in connection with mergers or acquisitions</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and monitoring</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection practices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your information to another service</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns. You can control cookie preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. International Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware of such collection, we will take steps to delete the information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@paylists.co.uk<br />
              Website: https://paylists.co.uk<br />
              Data Protection Officer: dpo@paylists.co.uk
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link 
                href="/user-agreement" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View User Agreement
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