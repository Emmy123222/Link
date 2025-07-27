import { Route } from "@/types/route"

export const routes: Route[] = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/payments-in", name: "Payments to receive" },
    { path: "/payments-out", name: "Payments to pay" },
    { path: "/customers", name: "Customers" },
    { path: "/vendors", name: "Vendors" },
    { path: "/business", name: "Business" },
    { path: "/add-payment-request", name: "Create a new request to receive payment" },
    { path: "/onboarding", name: "Welcome to paylist" },
    { path: "/my-account", name: "My account" },
    { path: "/add-business", name: "New business" },
    { path: "/reset-password", name: "Reset password" },
    { path: "/verify-email", name: "Verify email" },
    { path: "/onboarding/my-details", name: "My details" },
    { path: "/onboarding/add-business", name: "Create Business" },
    { path: "/vendors/add-vendor", name: "Add Vendor" },
    { path: "/customers/add-customer", name: "Add Customer" },
]