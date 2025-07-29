import { serv_add_customer, serv_add_vendor, serv_do_business_creation, serv_delete_vendor, serv_delete_customer, serv_get_business_customers, serv_get_business_vendors, serv_send_business_verify_email, serv_update_business, serv_update_business_address, serv_update_business_by_creator, serv_verify_code_from_email, serv_list_businesses } from "@/lib/supabase/functions"
import { TABLES } from "@supabase/functions/db"
import { supabase } from "../supabaseClient"
import { Business, BusinessCategory } from "@/types/business"

export const createBusiness = async (data: { business: Partial<Business>, userId: string }) => {
  const { data: res, error } = await serv_do_business_creation(data)
  if (error) throw error
  return res
}

export async function sendBusinessVerifyEmail(emailData: { email: string, user_id: string }) {
  const { data, error } = await serv_send_business_verify_email(emailData)
  if (error) throw error
  return data
}

export async function updateBusiness(data: { businessId: string, updates: Partial<Business> }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log(session?.access_token)
    const { data: res, error } = await serv_update_business({ ...data, token: session?.access_token || "" });
    if (error) throw error
    return res
  }
  catch (error) {
    throw error
  }
}

export async function getBusinessCategory(): Promise<BusinessCategory[]> {
  const { data, error } = await supabase
    .from(TABLES.BusinessCategory)
    .select("*")
  if (error) throw error

  return data
}

export async function verifyCodeFromEmail(emailData: { business: { email: string, ownerId: string, createdBy: string }, code: string }) {
  const { data, error } = await serv_verify_code_from_email(emailData)
  if (error) throw error
  return data as { success: boolean }
}

export async function createCustomerBusiness({ customerData, businessId, tempBusiness }: { customerData: Partial<Business>, businessId: string, tempBusiness: string[] }) {
  const { data, error } = await serv_add_customer({
    customer: customerData,
    businessId,
    business_customers: tempBusiness
  })
  if (error) throw error
  return data
}

export async function createVendorBusiness({ vendorData, businessId, tempBusiness }: { vendorData: Partial<Business>, businessId: string, tempBusiness: string[] }) {
  const { data, error } = await serv_add_vendor({
    vendor: vendorData,
    businessId,
    business_vendors: tempBusiness
  })
  if (error) throw error
  return data
}

export async function updateBusinessAddress(data: { businessId: string, updates: Partial<Business> }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_update_business_address({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res ? true : false
}

export async function getCustomers(data: { businessId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_get_business_customers({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function getVendors(data: { businessId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_get_business_vendors({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function deleteVendor(data: { vendorId: string, businessId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_delete_vendor({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function deleteCustomer(data: { customerId: string, businessId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_delete_customer({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function deleteBusiness(data: { businessId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_delete_customer({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function updateBusinessByCreator(data: { businessId: string, updates: Partial<Business> }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_update_business_by_creator({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}

export async function listBusinesses(data: { userId: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: res, error } = await serv_list_businesses({ ...data, token: session?.access_token || "" });
  if (error) throw error
  return res
}