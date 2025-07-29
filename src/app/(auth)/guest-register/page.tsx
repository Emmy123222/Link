import GuestUserRegistration from "@/components/auth/GuestUserRegistration"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

interface PageProps {
  searchParams: {
    email?: string
    paymentRequestId?: string
  }
}

export default async function GuestRegistrationPage({ searchParams }: PageProps) {
  const { email, paymentRequestId } = searchParams

  if (!email) {
    redirect("/login")
  }

  // Create Supabase client to verify the guest user exists
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options })
        }
      }
    }
  )

  // Verify guest user exists
  const { data: guestUser, error } = await supabase
    .from("Users")
    .select("id, email, is_guest")
    .eq("email", decodeURIComponent(email))
    .eq("is_guest", true)
    .single()

  if (error || !guestUser) {
    redirect("/login?error=guest_not_found")
  }

  return (
    <GuestUserRegistration 
      email={guestUser.email} 
      paymentRequestId={paymentRequestId}
    />
  )
}
