import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@/constants/tables";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCustomerBusiness, getCustomers, deleteCustomer } from "@/lib/supabase/business";
import { Business } from "@/types/business";
import { handleApiCall } from "@/lib/utils/api";

export const useCustomers = () => {
  return useMutation({
    mutationFn: async ({ businessId }: { businessId: string }) => {
      const res = await getCustomers({ businessId })
      return { data: res, status: "success" }
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  })
}

export const useCustomerByName = () => {
  return useMutation({
    mutationFn: async ({ name, bannedIds }: { name: string, bannedIds: string }) => {
      const { data, error } = await supabase
        .from("Businesses")
        .select("*, countryCode(*)")
        .like("business_name_lowercase", `%${name.toLowerCase()}%`)
        .not("ownerId", "is", null)
        .not("id", "in", bannedIds)
        .eq("is_deleted", false)  // Filter out deleted businesses
      return data;
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: async ({ businessId, customerId }: { businessId: string | number, customerId: string | number }) => await handleApiCall(
      async () => {
        const { data, error } = await supabase
          .from(TABLES.VendorCustomer)
          .insert({
            vendorId: businessId,
            customerId,
            active: true,
          })
          .select()
          .single();
        if (error) {
          throw error
        }
        return data
      },
      {
        loadingMessage: "Creating customer...",
        successMessage: "Customer created successfully",
        errorMessage: "Failed to create customer",
      }),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  });
};

export const useCreateCustomerBusiness = () => {
  return useMutation({
    mutationFn: async ({ customerData, businessId, tempBusiness }: { customerData: Partial<Business>, businessId: string, tempBusiness: string[] }) => await handleApiCall(
      async () => await createCustomerBusiness({ customerData, businessId, tempBusiness }),
      {
        loadingMessage: "Creating customer...",
        successMessage: "Customer created successfully",
        errorMessage: "Failed to create customer",
      }),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error(error.message)
    },
  })
}

export const useGetCustomersByBusinessName = ({ businessId, businessName }: { businessId: string, businessName: string }) => {
  return useQuery({
    queryKey: ['customers', businessId],
    queryFn: async () => {
      if (!businessId) {
        return []
      }
      const { data: business, error } = await supabase.from(TABLES.UserBusiness).select("*, business(*)").eq("active", true).like("business.business_name_lower", `%${businessName}%`);
      if (error) {
        console.error(error.message)
      }
      return business?.map(item => item.business).slice(0, 20)
    },
  })
}

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: async ({ customerId, businessId }: { customerId: string, businessId: string }) => {
      const res = await deleteCustomer({ customerId, businessId })
      return res
    }
  })
}