import { useMutation, useQuery } from "@tanstack/react-query";
import { TABLES } from "@/constants/tables";
import { supabase } from "@/lib/supabaseClient";
import { Business, BusinessSkeleton } from "@/types/business";
import { handleApiCall } from "@/lib/utils/api";
import { createBusiness, getBusinessCategory, sendBusinessVerifyEmail, listBusinesses, updateBusiness, updateBusinessAddress, updateBusinessByCreator, verifyCodeFromEmail } from "@/lib/supabase/business";
import { toast } from "sonner";

export const useBusinesses = () => {
  return useMutation({
    mutationFn: async (userId: string) => await listBusinesses({ userId }),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useBusinessById = (id: string) => {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => (await supabase.from("Businesses").select("*").eq("id", Number(id)).eq("is_deleted", false).single()).data
  })
}

export const useBusinessCreate = () => {
  return useMutation({
    mutationFn: async (data: { business: Partial<Business>, userId: string }) => await handleApiCall(
      async () => await createBusiness(data),
      {
        loadingMessage: 'Creating business...',
        successMessage: 'Business created',
        errorMessage: 'Failed to create business'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  })
}
export const useBusinessVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: { email: string, user_id: string }) => await handleApiCall(
      async () => await sendBusinessVerifyEmail(data),
      {
        loadingMessage: 'Sending verify code...',
        successMessage: 'Verify code sent',
        errorMessage: 'Failed to send verify code'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  })
}

export const useVerifyCodeFromEmail = () => {
  return useMutation({
    mutationFn: async (emailData: { business: { email: string, ownerId: string, createdBy: string }, code: string }) => await handleApiCall(
      async () => await verifyCodeFromEmail(emailData),
      {
        loadingMessage: 'Verifying code...',
        successMessage: 'Code verified',
        errorMessage: 'Failed to verify code'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useBusinessCategory = () => {
  return useQuery({
    queryKey: ['businessCategory'],
    queryFn: getBusinessCategory
  })
}

export const useCreateBusiness = () => {
  return useMutation({
    mutationFn: async (data: { business: Partial<Business>, userId: string }) => {
      const result = await createBusiness(data)
      return result
    }
  })
}

export const useUpdateBusiness = () => {
  return useMutation({
    mutationFn: async (data: { businessId: string, updates: Partial<Business> }) => await handleApiCall(
      async () => await updateBusiness(data),
      {
        loadingMessage: 'Updating business...',
        successMessage: 'Business updated',
        errorMessage: 'Failed to update business'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export const useUpdateBusinessByCreator = () => {
  return useMutation({
    mutationFn: async (data: { businessId: string, updates: Partial<Business> }) => await handleApiCall(
      async () => await updateBusinessByCreator(data),
      {
        loadingMessage: 'Updating business...',
        successMessage: 'Business updated',
        errorMessage: 'Failed to update business'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export const useBusinessesByUserId = () => {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const { data, error } = await supabase.from("Businesses").select('*').eq('id', Number(businessId)).eq("is_deleted", false).single()
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}