import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@supabase/functions/db";

export const getPhoneByCountryName = async (countryName: string) => {
  const { data, error } = await supabase.from(TABLES.PhoneAreaCode).select("*").eq("country", countryName).single();
  if (error) throw error;
  return data;
}

export const getCountryByCountryName = async (countryName: string) => {
  const { data, error } = await supabase.from(TABLES.CountryCode).select("*").eq("countryName", countryName).single();
  if (error) throw error;
  return data;
}

export const updateProfile = async (profile: Object) => {
  const res = await supabase.from(TABLES.Users).upsert(profile).select().single();
  return res;
}