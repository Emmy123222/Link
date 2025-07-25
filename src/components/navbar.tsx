"use client"

import { useRef, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { UserAccountDropdown } from "@/components/userAccountDropdown"
import { ContactDrawer } from "@/components/contactDrawer"
import { MenuListDropdown } from "@/components/menuListDropdown"
import { IoMdMenu } from "react-icons/io"
import { useApp } from "@/providers/AppProvider"
import { routes } from "@/constants/routes"
import { FiMessageCircle } from "react-icons/fi"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu, MenuItem, MenuButton } from "@/components/Menu"
import { Avatar } from "./avatar"
import { Button } from "./ui/button"
import { Business } from "@/types/business"
import { useBusinesses } from "@/hooks/use-businesses"
import { FaSpinner } from "react-icons/fa"
import { useNavbarTitle } from "@/context/NavbarTitleContext"
import { isPersonalBusiness, getBusinessTypeDisplayName } from "@/utils/businessUtils"

export function Navbar() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState("Dashboard")

  const { user, currentBusiness, setCurrentBusiness, isLoadingUser } = useApp()!
  const { mutateAsync: getBusinesses, isPending: isLoadingBusinesses } = useBusinesses()

  const router = useRouter()
  const isMobile = useIsMobile()
  const contactButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { businesses, setBusinesses } = useApp()!
  const { title } = useNavbarTitle()

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (user?.id) {
        const businesses = await getBusinesses(user?.id as string)
        setBusinesses(businesses || [])
        if (businesses.length > 0) {
          // Only access localStorage on client-side
          let savedBusiness = null
          if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("currentBusiness")
            if (saved) {
              try {
                savedBusiness = JSON.parse(saved)
              } catch (error) {
                console.warn('Failed to parse saved business from localStorage:', error)
              }
            }
          }
          setCurrentBusiness(savedBusiness || businesses[0])
        }
      }
    }
    if (user && !isLoadingUser) {
      fetchBusinesses()
    }
  }, [user])

  useEffect(() => {
    // Set page title based on current path
    const item = routes.find(item => pathname.includes(item.path));
    const title = item ? item.name : "Page Not found!";
    setPageTitle(title)
  }, [pathname])

  const handleContactButtonClick = () => {
    // Add animation class
    if (contactButtonRef.current) {
      contactButtonRef.current.classList.add("animate-pulse-scale")

      // Remove animation class after animation completes
      setTimeout(() => {
        if (contactButtonRef.current) {
          contactButtonRef.current.classList.remove("animate-pulse-scale")
        }
      }, 300) // Match with animation duration
    }

    setIsContactDrawerOpen(true)
  }
  const handleBusinessChange = (business: Business) => {
    setCurrentBusiness(business)
    // Only access localStorage on client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem("currentBusiness", JSON.stringify(business))
    }
  }

  return (
    <>
      <header className="min-h-16 bg-white border-b flex items-center justify-between px-6 max-h-4/5 sticky top-0 z-10">
        <div className="relative block sm:hidden">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => setIsMenuDropdownOpen(prev => !prev)}
            aria-label="Menu"
            aria-expanded={isMenuDropdownOpen}
            aria-haspopup="true"
          >
            <IoMdMenu size={24} />
          </button>
        </div>
        {!isMobile && <h1 className="text-2xl font-bold">{title || pageTitle}</h1>}
        
        <div className="flex items-center space-x-4">
          <Button
            ref={contactButtonRef}
            variant="ghost"
            className="p-2 text-gray-500 hover:text-gray-700 transition-all"
            onClick={handleContactButtonClick}
            aria-label="Contact us"
          >
            <FiMessageCircle size={20} />
          </Button>
          <Menu button={
            <MenuButton>
              <div className="flex items-center space-x-2">
                <span>{currentBusiness ? currentBusiness.business_name || "Not have name" : "Select your Business"}</span>
                {currentBusiness && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isPersonalBusiness(currentBusiness) 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getBusinessTypeDisplayName(currentBusiness)}
                  </span>
                )}
              </div>
            </MenuButton>
          }>
            {!isLoadingBusinesses ? businesses && businesses.length > 0 && businesses.map((business: Business) => {
              return (
                <MenuItem
                  key={business.id}
                  onClick={() => handleBusinessChange(business)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{business.business_name || business.name || "Not have name"}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                      isPersonalBusiness(business) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getBusinessTypeDisplayName(business)}
                    </span>
                  </div>
                </MenuItem>
              )
            }) : <div className="flex items-center justify-center h-full"><FaSpinner size={30} className="animate-spin" /></div>}
            <MenuItem onClick={() => router.push("/onboarding")}>Add Business</MenuItem>
          </Menu>
          <Button
            variant="ghost"
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            onClick={() => setIsUserDropdownOpen(prev => !prev)}
            aria-label="User account"
            aria-expanded={isUserDropdownOpen}
            aria-haspopup="true"
          >
            <Avatar src={user?.avatar_url || null} name={user?.name || ""} width={32} height={32} entityType="user" />
          </Button>
        </div>
      </header >
      {isMobile && <h1 className="text-2xl font-bold text-center mt-2">{title || pageTitle}</h1>}

      <MenuListDropdown isOpen={isMenuDropdownOpen} onClose={() => setIsMenuDropdownOpen(false)} />
      <UserAccountDropdown isOpen={isUserDropdownOpen} onClose={() => setIsUserDropdownOpen(false)} />
      <ContactDrawer isOpen={isContactDrawerOpen} onClose={() => setIsContactDrawerOpen(false)} />
    </>
  )
}
