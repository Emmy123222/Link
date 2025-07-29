import { useMutation, useQuery } from "@tanstack/react-query";
import { TABLES } from "@supabase/functions/db";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { getCountry } from "@/lib/supabase/other";

export const useCountry = () => {
  return useQuery({
    queryKey: ["country"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.CountryCode)
        .select("*, phone_code(*)");

      if (error) throw error;
      return data;
    },
  });
};

export const useGetCountry = () => {
  return useMutation({
    mutationFn: async (data: { key: string; data: string }) => {
      return await getCountry(data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
