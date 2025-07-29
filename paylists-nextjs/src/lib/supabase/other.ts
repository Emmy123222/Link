import { TABLES } from "@supabase/functions/db"
import { supabase } from "../supabaseClient"
import { handleApiCall } from "../utils/api"

export const getCountry = async (data: { key: string, data: string }) => {
  return handleApiCall(
    async () => {
      const { data: country, error } = await supabase
        .from(TABLES.CountryCode)
        .select("*")
        .eq(data.key, data.data)
        .single()

      if (error) throw error
      return country
    },
    {
      loadingMessage: "Fetching country data...",
      successMessage: "Country data retrieved successfully!",
      errorMessage: "Failed to fetch country data",
    }
  )
}

export const getAutoCompleteCompany = async () => {
  const { data: company, error } = await supabase
    .from(TABLES.BusinessCategory)
    .select("*")
  if (error) {
    throw error
  }
  return company
}