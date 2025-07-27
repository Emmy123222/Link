"use client"

import { Image } from "@/components/ui/image"
import { useApp } from "@/providers/AppProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {

  const { businesses } = useApp()!
  const router = useRouter()

  return (
    < main className="flex-1 p-6 md:grid md:grid-cols-2 md:grid-rows-2 overflow-auto w-full gap-10" >
      {/* Payments to receive section */}
      < section className="md:col-span-1 md:row-span-1 align-middle" >
        <h2 className="text-lg font-medium mb-4">Payments to receive</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm w-full ">
          <h3 className="text-center mb-6">Collection success</h3>
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-600"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray="0 264"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">0%</span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Payments to pay section */}
      < section className="md:col-span-1 md:row-span-1" >
        <h2 className="text-lg font-medium mb-4">Payments to pay</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm w-full">
          <h3 className="text-center mb-6">Payable status</h3>
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-600"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray="0 264"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">0%</span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Integrations section */}
      < div className="sm:col-span-2 md:row-span-1 grid grid-cols-1 md:grid-cols-2 gap-6" >
        {/* Payment integration */}
        < section >
          <h2 className="text-lg font-medium mb-4 text-center">Payment integration</h2>
          <div className="flex justify-center mb-4">
            <Image
              src="/images/payment-welcome.svg"
              alt="Payment integration"
              width={200}
              height={150}
              priority
            />
          </div>
          <button className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            Get paid faster
          </button>
        </section >

        {/* Accounting integration */}
        < section >
          <h2 className="text-lg font-medium mb-4 text-center">Accounting integration</h2>
          <div className="flex justify-center mb-4">
            <Image
              src="/images/accounting.svg"
              alt="Accounting integration"
              width={200}
              height={150}
              priority
            />
          </div>
          <button className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            Upload invoices
          </button>
        </section >
      </div >
    </main >
  )
}
