"use client"

import Link from "next/link"
import { IoMdGrid, IoMdSearch, IoMdTrash } from "react-icons/io"
import { SiXero } from "react-icons/si"
import { ImMagicWand } from "react-icons/im"
import { useCustomers } from "@/hooks/use-customers"
import { useApp } from "@/providers/AppProvider"
import { useEffect, useState } from "react"
import { CardList } from "@/components/cardList"
import { TableList } from "@/components/TableList"
import { Button } from "@/components/ui/button"
import { FaEdit } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { TableColumn } from "@/components/TableList"
import { FaSpinner } from "react-icons/fa"
import { useDeleteCustomer } from "@/hooks/use-customers"
import { useCustomersContext } from "./layout"
import { Badge } from "@/components/ui/badge"

export default function CustomersPage() {
  const router = useRouter()
  const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteCustomer()
  const { customers, setCustomers } = useCustomersContext()
  const [cardView, setCardView] = useState(true)
  const [filteredCustomers, setFilteredCustomers] = useState(customers)
  const [search, setSearch] = useState("")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15) // Fixed items per page

  const { mutateAsync: getCustomers, isPending: isLoading } = useCustomers()
  const { currentBusiness } = useApp()

  useEffect(() => {
    if (currentBusiness) {
      getCustomers({ businessId: currentBusiness.id }).then((res) => {
        if (res.status === "success") {
          setCustomers(res.data)
        }
      }).catch((err) => {
        console.error(err)
        setCustomers([])
      })
    }
  }, [currentBusiness])

  useEffect(() => {
    const filtered = customers.filter((customer: any) => customer.business_name.toLowerCase().includes(search.toLowerCase()))
    setFilteredCustomers(filtered)
    // Reset to first page when search changes
    setCurrentPage(1)
  }, [search, customers])

  // Calculate pagination
  const totalItems = filteredCustomers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredCustomers.slice(startIndex, endIndex)

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const tableColumns: TableColumn<any>[] = [
    { label: "#", accessor: "id" },
    {
      label: "Customer",
      accessor: "business_name",
    },
    { label: "Customer Name", accessor: "name" },
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
          <Button variant="outline" className="bg-red-500 text-white" onClick={() => {
            deleteCustomer({ customerId: row.id, businessId: currentBusiness!.id }).then((res) => {
              setCustomers(customers.filter((customer: any) => customer.id !== row.id))
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-muted rounded-lg">
        <div className="text-sm text-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} customers
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
            <label htmlFor="search" className="text-sm text-muted-foreground mb-1 block">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500"
                placeholder="Search customers..."
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground">
                <IoMdSearch size={18} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 w-full md:w-auto sm:flex-row">
            <Button variant="outline" colorSchema={cardView ? "green" : "white"} onClick={() => setCardView(prev => !prev)} className="flex items-center gap-2">
              <IoMdGrid size={20} />
            </Button>
            <Button variant="outline" colorSchema="white" className="flex items-center gap-2">
              <SiXero size={20} className="text-sky-500" />
              <span>Sync with XERO</span>
            </Button>
            <Link
              href="/customers/add-customer"
              className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <span>Create a new customer</span>
              <ImMagicWand size={18} />
            </Link>
          </div>
        </div>

        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="w-10 h-10 animate-spin text-muted-foreground" />
            </div>
          ) : customers?.length === 0 ? (
            <p className="text-xl text-muted-foreground w-full text-center">No customers added yet :)</p>
          ) : filteredCustomers?.length === 0 ? (
            <p className="text-xl text-muted-foreground w-full text-center">No customers found matching your search</p>
          ) : cardView ? (
            <>
              <CardList customers={currentItems || []} />
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
