"use client"

import Link from "next/link"
import { IoMdGrid, IoMdSearch, IoMdTrash } from "react-icons/io"
import { SiXero } from "react-icons/si"
import { ImMagicWand } from "react-icons/im"
import { useVendors } from "@/hooks/use-vendors"
import { useApp } from "@/providers/AppProvider"
import { useEffect, useState } from "react"
import { CardList } from "@/components/cardList"
import { TableList } from "@/components/TableList"
import { Button } from "@/components/ui/button"
import { FaEdit } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { TableColumn } from "@/components/TableList"
import { FaSpinner } from "react-icons/fa"
import { useDeleteVendor } from "@/hooks/use-vendors"
import { useVendorsContext } from "./layout"
import { Badge } from "@/components/ui/badge"

export default function VendorPage() {
  const router = useRouter()
  const { mutateAsync: deleteVendor, isPending: isDeleting } = useDeleteVendor()
  const { vendors, setVendors } = useVendorsContext()
  const [cardView, setCardView] = useState(true)
  const [filteredVendors, setFilteredVendors] = useState(vendors)
  const [search, setSearch] = useState("")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15) // Fixed items per page

  const { mutateAsync: getVendors, isPending: isLoading } = useVendors()
  const { currentBusiness } = useApp()

  useEffect(() => {
    if (currentBusiness) {
      getVendors({ businessId: currentBusiness.id }).then((res) => {
        if (res.status === "success") {
          setVendors(res.data)
        }
      }).catch((err) => {
        console.error(err)
        setVendors([])
      })
    }
  }, [currentBusiness])

  useEffect(() => {
    const filtered = vendors.filter((vendor: any) => vendor.business_name.toLowerCase().includes(search.toLowerCase()))
    setFilteredVendors(filtered)
    // Reset to first page when search changes
    setCurrentPage(1)
  }, [search, vendors])

  // Calculate pagination
  const totalItems = filteredVendors.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredVendors.slice(startIndex, endIndex)

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const tableColumns: TableColumn<any>[] = [
    { label: "#", accessor: "id" },
    {
      label: "Vendor",
      accessor: "business_name",
    },
    { label: "Vendor Name", accessor: "name" },
    {
      label: "Phone",
      accessor: "mobile_phone_number",
    },
    { label: "Email", accessor: "email" },
    { label: "Registration Number", accessor: "registration_number" },
    { label: "Address", accessor: "street_1" },
    { label: "City", accessor: "city" },
    {
      label: "Status", accessor: "ownerId", render: (row: any) => (
        <Badge variant="outline" color={row.ownerId ? "success" : "error"}>
          {row.ownerId ? "Verified" : "Unverified"}
        </Badge>
      )
    },
    {
      label: "Actions", accessor: "actions", render: (row: any) => (
        <>
          <Button variant="outline" className="bg-green-500 text-white mr-2" onClick={() => router.push(`/customers/${row.id}`)}>
            <FaEdit size={20} />
          </Button>
          <Button variant="outline" className="bg-red-500 text-white" onClick={() => {
            deleteVendor({ vendorId: row.id, businessId: currentBusiness!.id }).then((res) => {
              setVendors(vendors.filter((vendor: any) => vendor.id !== row.id))
            })
          }}>
            <IoMdTrash size={20} />
          </Button>
        </>
      )
    },
  ]

  // Pagination component
  const PaginationControls = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} vendors
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Show first page if not near start */}
            {currentPage > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  className="px-3 py-1"
                >
                  1
                </Button>
                {currentPage > 4 && <span className="px-2">...</span>}
              </>
            )}
            
            {/* Show pages around current page */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages))
              if (pageNum < currentPage - 2 || pageNum > currentPage + 2) return null
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 ${pageNum === currentPage ? 'bg-green-600 text-white' : ''}`}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            {/* Show last page if not near end */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-1"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1"
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-full mx-auto">
        {/* Search and actions bar */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <label htmlFor="search" className="text-sm text-gray-600 mb-1 block">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500"
                placeholder="Search vendors..."
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500">
                <IoMdSearch size={18} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full md:w-auto">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-3 md:hidden">
              {/* Primary Action - Create New Vendor */}
              <Link
                href="/vendors/add-vendor"
                className="flex items-center justify-center gap-3 py-4 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                <ImMagicWand size={20} />
                <span>Create a new vendor</span>
              </Link>
              
              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  colorSchema="white" 
                  className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded-lg shadow-sm"
                >
                  <SiXero size={18} className="text-sky-600" />
                  <span className="text-sky-700 font-medium">Sync XERO</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  colorSchema={cardView ? "green" : "gray"} 
                  onClick={() => setCardView(prev => !prev)} 
                  className={`flex items-center justify-center gap-2 py-3 px-4 border-2 transition-all duration-200 rounded-lg shadow-sm ${
                    cardView 
                      ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <IoMdGrid size={18} />
                  <span className="font-medium">{cardView ? 'Card View' : 'Grid View'}</span>
                </Button>
              </div>
            </div>

            {/* Desktop Layout (unchanged) */}
            <div className="hidden md:flex flex-row gap-3">
              <Button variant="outline" colorSchema={cardView ? "green" : "white"} onClick={() => setCardView(prev => !prev)} className="flex items-center gap-2">
                <IoMdGrid size={20} />
              </Button>
              <Button variant="outline" colorSchema="white" className="flex items-center gap-2">
                <SiXero size={20} className="text-sky-500" />
                <span>Sync with XERO</span>
              </Button>
              <Link
                href="/vendors/add-vendor"
                className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <span>Create a new vendor</span>
                <ImMagicWand size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="w-10 h-10 animate-spin text-gray-600" />
            </div>
          ) : vendors?.length === 0 ? (
            <p className="text-xl text-gray-600 w-full text-center">No vendors added yet :)</p>
          ) : filteredVendors?.length === 0 ? (
            <p className="text-xl text-gray-600 w-full text-center">No vendors found matching your search</p>
          ) : cardView ? (
            <>
              <CardList customers={currentItems || []} route="/vendors" />
              <PaginationControls />
            </>
          ) : (
            <>
              <TableList data={currentItems || []} columns={tableColumns} />
              <PaginationControls />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
