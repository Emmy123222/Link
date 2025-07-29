"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Image } from "@/components/ui/image"
import { IoMdArrowBack } from "react-icons/io"
import { useCustomerByName } from "@/hooks/use-customers"
import { useApp } from "@/providers/AppProvider"
import { BusinessItem } from "@/components/businessItem"
import { Business } from "@/types/business"

type ExtendedBusiness = Business & {
  countryCode?: {
    countryName: string;
  };
}
import { useRouter } from "next/navigation"

// Form validation schema
const vendorSchema = z.object({
  vendorName: z.string().min(1, { message: "Vendor name is required" }),
})

type VendorFormValues = z.infer<typeof vendorSchema>
type CustomerType = "business" | "private"

export default function AddPaymentRequestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<ExtendedBusiness | null>(null)
  const [businesses, setBusinesses] = useState<ExtendedBusiness[]>([])
  const { currentBusiness } = useApp()!
  const { mutateAsync: searchBusiness, isPending: isSearchBusinessPending } = useCustomerByName()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorName: "",
    },
  })

  const handelSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)
    setValue("vendorName", value)
    setSelectedBusiness(null)
    if (value.trim().length > 0) {
      setBusinesses([]) // Clear previous results while searching
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (name && name.trim().length > 0) {
        try {
          // Create a list of banned IDs (current business)
          const bannedIds = currentBusiness ? `(${currentBusiness.id})` : "()"
          const res = await searchBusiness({ name, bannedIds })
          if (res && res.length > 0) {
            // Type cast the results to match ExtendedBusiness
            setBusinesses(res as unknown as ExtendedBusiness[])
          } else {
            setBusinesses([])
          }
        } catch (error) {
          console.error("Error searching customers:", error)
          setBusinesses([])
        }
      } else {
        setBusinesses([])
      }
    }
    
    // Debounce the search
    const timeoutId = setTimeout(fetchData, 300)
    return () => clearTimeout(timeoutId)
  }, [name, searchBusiness, currentBusiness])

  const onSubmit = async (data: VendorFormValues) => {
    if (selectedBusiness) {
      // Navigate to payment request form with selected customer
      router.push(`/add-payment-request/${selectedBusiness.id}`)
      return
    }

    setIsLoading(true)
    try {
      // This would be replaced with your actual API call for searching
      console.log("Form submitted:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Navigate to next step or show success
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewVendor = () => {
    setIsTypeModalOpen(true)
  }


  const handleBusinessSelect = (business: ExtendedBusiness) => {
    setSelectedBusiness(business)
    setName(business.business_name)
    setValue("vendorName", business.business_name)
    setBusinesses([])
  }

  return (

    <main className="flex-1 p-6 overflow-auto">
      <Link
        href="/payments-in"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <IoMdArrowBack className="mr-2 h-4 w-4" />
        <span>Back</span>
      </Link>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left side - Illustration */}
        <div className="hidden md:block md:w-1/2 pr-8">
          <Image
            src="/images/products.svg"
            alt="Payment request illustration"
            width={500}
            height={400}
          />
        </div>

        {/* Right side - form */}
        <div className="w-full md:w-1/2">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-semibold mb-2">Select a customer</h1>
            <p className="text-gray-600 mb-6">Let's find the customer you are creating the request for.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6 relative">
                <label htmlFor="vendorName" className="block text-sm font-medium mb-2">
                  Customer name
                </label>
                <input
                  id="vendorName"
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.vendorName ? "border-red-500" : selectedBusiness ? "border-green-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${selectedBusiness ? "bg-green-50" : ""}`}
                  placeholder="Enter customer name*"
                  value={name}
                  onChange={handelSearch}
                />
                {errors.vendorName && <p className="mt-1 text-sm text-red-600">{errors.vendorName.message}</p>}
                {selectedBusiness && <p className="mt-1 text-sm text-green-600">Customer selected: {selectedBusiness.business_name}</p>}
                
                {/* Search Results Dropdown */}
                {businesses.length > 0 && !selectedBusiness && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="text-sm text-gray-500 p-2 border-b">
                      {isSearchBusinessPending ? "Searching..." : `${businesses.length} customer${businesses.length !== 1 ? 's' : ''} found`}
                    </div>
                    {businesses.map((business: ExtendedBusiness) => (
                      <div
                        key={business.id}
                        className="cursor-pointer hover:bg-muted/50 p-2 border-b last:border-b-0"
                        onClick={() => handleBusinessSelect(business)}
                      >
                        <BusinessItem
                          name={business.business_name}
                          address={`${business.street_1 || ''}, ${business.city || ''}, ${business.countryCode?.countryName || ''}`}
                          email={business.email}
                          onClick={() => handleBusinessSelect(business)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {name.trim().length > 0 && businesses.length === 0 && !isSearchBusinessPending && !selectedBusiness && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
                    <div className="text-sm text-gray-500 p-3">
                      No customers found. Try a different search term or create a new customer.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border text-foreground rounded-md hover:bg-muted/50 transition-colors"
                  onClick={handleCreateNewVendor}
                >
                  Create new customer
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : selectedBusiness ? "Continue with customer" : "Search customers"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
