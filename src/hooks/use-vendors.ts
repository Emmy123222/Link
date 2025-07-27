import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@/constants/tables";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useApp } from "@/providers/AppProvider";
import { toast } from "react-toastify";
import { createVendorBusiness, getVendors, deleteVendor } from "@/lib/supabase/business";
import { Business } from "@/types/business";
import { handleApiCall } from "@/lib/utils/api";

export const useVendors = () => {
  return useMutation({
    mutationFn: async ({ businessId }: { businessId: string }) => {
      const res = await getVendors({ businessId })
      return { data: res, status: "success" }
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export const useVendorByName = () => {
  return useMutation({
    mutationFn: async ({ name, bannedIds }: { name: string, bannedIds: string }) => {
      const { data, error } = await supabase
        .from("Businesses")
        .select("*, countryCode(*)")
        .like("business_name_lowercase", `%${name.toLowerCase()}%`)
        .not("ownerId", "is", null)
        .not("id", "in", bannedIds)
        .eq("is_deleted", false)  // Filter out deleted businesses
      return data
    },
  });
};

export const useCreateVendor = () => {
  return useMutation({
    mutationFn: async ({ businessId, vendorId }: { businessId: string | number, vendorId: string | number }) => await handleApiCall(
      async () => {
        const { data, error } = await supabase
          .from(TABLES.VendorCustomer)
          .insert({
            customerId: businessId,
            vendorId,
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
        loadingMessage: "Creating vendor...",
        successMessage: "Vendor created successfully",
        errorMessage: "Failed to create vendor",
      }),
    onSuccess: (data) => {
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  });
};

export const useCreateVendorBusiness = () => {
  return useMutation({
    mutationFn: async ({ vendorData, businessId, tempBusiness }: { vendorData: Partial<Business>, businessId: string, tempBusiness: string[] }) => handleApiCall(
      async () => await createVendorBusiness({ vendorData, businessId, tempBusiness }),
      {
        loadingMessage: "Vendor is being created...",
        successMessage: "Vendor created successfully",
        errorMessage: "Failed to create vendor",
      }
    ),
    onSuccess: (data) => {
      return data;
    },
    onError: (error: Error) => {
      console.log(error)
      toast.error(error.message)
    },
  });
};

export const useDeleteVendor = () => {
  return useMutation({
    mutationFn: async ({ vendorId, businessId }: { vendorId: string, businessId: string }) => {
      const res = await deleteVendor({ vendorId, businessId })
      return { data: res, status: "success" }
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  });
};