"use client"

import { Image } from "@/components/ui/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IoMdArrowBack, IoMdArrowForward, IoMdBriefcase, IoMdHome, IoMdAdd, IoMdRemove } from "react-icons/io"
import { useState } from "react"
import { Handshake } from "lucide-react"
import { TbTrolley } from "react-icons/tb"
import { useApp } from "@/providers/AppProvider"
import { canCreateCustomers } from "@/utils/businessUtils"

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  delay: string;
}

interface CreateOption {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const { currentBusiness } = useApp()!; // Add this to get current business context

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCreateMenu = () => {
    setIsCreateMenuOpen(!isCreateMenuOpen);
  };

  const navigationItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <IoMdHome fontSize={"40px"} className="text-muted-foreground" />,
      delay: "delay-75"
    },
    {
      href: "/payments-in",
      label: "Payments to receive",
      icon: <IoMdArrowBack className="text-green-600" fontSize={"40px"} />,
      delay: "delay-100"
    },
    {
      href: "/payments-out",
      label: "Payments to pay",
      icon: <IoMdArrowForward fontSize={"40px"} className="text-orange-500" />,
      delay: "delay-150"
    },
    // Only show customers for businesses that can create customers
    ...(canCreateCustomers(currentBusiness) ? [{
      href: "/customers",
      label: "Customers",
      icon: <Handshake className="text-muted-foreground" size={40} />,
      delay: "delay-100"
    }] : []),
    {
      href: "/vendors",
      label: "Vendors",
      icon: <TbTrolley fontSize={"40px"} className="text-muted-foreground" />,
      delay: "delay-100"
    },
    {
      href: "/business",
      label: "My business",
      icon: <IoMdBriefcase fontSize={"40px"} className="text-muted-foreground" />,
      delay: "delay-100"
    }
  ];

  const createOptions: CreateOption[] = [
    // Only show invoice and payment request creation for businesses that can send invoices
    ...(canCreateCustomers(currentBusiness) ? [
      {
        href: "/customers?type=Payment request",
        label: "Payment request",
        icon: <IoMdArrowBack className="text-green-600" fontSize={"20px"} />
      },
      {
        href: "/customers?type=Invoice",
        label: "Invoice",
        icon: <IoMdArrowBack className="text-blue-600" fontSize={"20px"} />
      }
    ] : []),
    {
      href: "/customers?type=Bill",
      label: "Bill",
      icon: <IoMdArrowForward className="text-orange-500" fontSize={"20px"} />
    },
    {
      href: "/customers?type=Planning payment",
      label: "Planning payment",
      icon: <IoMdArrowForward className="text-purple-500" fontSize={"20px"} />
    }
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center px-4 py-3 gap-2 align-middle text-lg ${isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:bg-accent/50"
          }`}
      >
        {item.icon}
        <span
          className={`transition-all duration-100 ease-in-out ${item.delay} ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
            }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <div className={`hidden sm:flex bg-card border-r flex-col h-screen transition-all duration-100 ease-in-out fixed ${isExpanded ? 'w-64' : 'w-16'
        }`}>
        {/* Logo */}
        <div className="p-4 border-b h-16 overflow-hidden cursor-pointer" onClick={toggleSidebar}>
          <Link href="/dashboard" onClick={(e) => e.preventDefault()}>
            <Image
              src={isExpanded ? "/logo.svg" : "/short.png"}
              alt="Paylists Logo"
              width={120}
              height={32}
              className="transition-all duration-100 ease-in-out"
              style={{ height: 'auto' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4">
          {navigationItems.map(renderNavItem)}
        </nav>

        {/* Create menu */}
        <div className="p-2">
          {/* Main create button */}
          <button
            onClick={toggleCreateMenu}
            className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {isCreateMenuOpen ? (
              <IoMdRemove fontSize={"20px"} className="text-white" />
            ) : (
              <IoMdAdd fontSize={"20px"} className="text-white" />
            )}
            <span className={`transition-all duration-100 ease-in-out delay-200 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
              }`}>
              Create
            </span>
          </button>

          {/* Collapsible create options */}
          {isCreateMenuOpen && (
            <div className={`mt-2 space-y-1 transition-all duration-200 ease-in-out ${isExpanded ? "opacity-100 max-h-96" : "opacity-0 max-h-0 hidden"}`}>
              {createOptions.map((option, index) => (
                <Link
                  key={option.href}
                  href={option.href}
                  className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent/50 rounded-md transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
