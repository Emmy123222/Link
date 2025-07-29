import uniqBy from "npm:lodash.uniqby";
import { TABLES } from "../db.ts";
import { supabase } from "../config.ts";
import { NotFoundException } from "../exceptions.ts";
import { Business } from "../types/business.ts";
import { CreationType } from "../types/creation-type.ts";

export async function check_if_email_is_in_business_with_owner(email: string) {
  const { data: businesses, error } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("email", email)
  if (error) {
    throw new Error(error.message);
  }
  if (!businesses) {
    return false;
  }
  return businesses.some((b) => b.active);
}

export async function check_if_business_exists(
  email: string,
  userEmail?: string
) {
  const { data: businesses, error } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("email", userEmail || email);
  if (error) {
    throw new Error(error.message);
  }
  return {
    existingBusiness: businesses[0],
    businessesLength: businesses.length,
    businesses: businesses,
  };
}

export async function create_business_manually(
  business: Business,
  userId: string
) {
  business.creation_type = CreationType.MANUALLY;
  business.active = true;
  business.ownerId = userId;
  const { data, error } = await supabase
    .from(TABLES.Business)
    .insert(business)
    .select()
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Failed to create business");
  return data;
}

export async function create_business_by_other_user(
  business: Business,
  otherUserId: string
) {
  business.creation_type = CreationType.BY_OTHER_USER;
  business.active = true;
  business.createdBy = otherUserId;
  business.ownerId = null;
  const { data, error } = await supabase
    .from(TABLES.Business)
    .insert(business)
    .select()
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Failed to create business");
  return data;
}

// export async function delete_email_to_verify(userId: string, email: string) {
//   await Firestore.removeDoc(`users/${userId}/email_to_verify/${email}`);
// }

export async function claim_ownership_on_business(
  business: Business,
  userId: string
) {
  const { data: businesses, error } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("email", business.email)
    .eq("ownerId", userId);

  if (error) {
    throw new Error(error.message);
  }

  if (!businesses) {
    return { id: null };
  }

  const { data: customerVendors } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .in(
      "customerId",
      businesses.map((business) => business.id)
    );
  const { data: vendorCustomers } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .in(
      "vendorId",
      businesses.map((business) => business.id)
    );

  await supabase
    .from(TABLES.Business)
    .update({
      ownerId: userId,
      is_deleted: true,
      active: false,
      vendors: [],
      customers: [],
    })
    .eq("email", business.email)
    .eq("ownerId", userId);

  // add the new MAIN business
  const newBusiness = await create_business_manually(
    { ...business, isPrimaryBusiness: true },
    userId
  );
  if (!newBusiness) throw new Error("Failed to create new business!");

  await Promise.all(
    (vendorCustomers ?? []).map((ref) => {
      return supabase.from(TABLES.VendorCustomer).insert({
        vendor: ref.vendor,
        customer: newBusiness.id,
      });
    })
  );

  await Promise.all(
    (customerVendors ?? []).map((ref) => {
      return supabase.from(TABLES.VendorCustomer).insert({
        vendor: newBusiness.id,
        customer: ref.customer,
      });
    })
  );

  for (let i = 0; i < businesses.length; i++) {
    const existingBusiness = businesses[i];
    await update_reqs_with_new_businessOwnerId({
      businessId: existingBusiness.id,
      newOwnerId: newBusiness.id,
      customerOwnerId: userId,
    });

    await supabase
      .from(TABLES.VendorCustomer)
      .update({
        customer: newBusiness.id,
      })
      .eq("customer", existingBusiness.id);

    await supabase
      .from(TABLES.VendorCustomer)
      .update({
        vendor: newBusiness.id,
      })
      .eq("vendor", existingBusiness.id);
  }

  return { id: newBusiness.id };
}

export async function update_reqs_with_new_businessOwnerId({
  businessId,
  newOwnerId,
  customerOwnerId,
}: {
  businessId: number;
  newOwnerId: string;
  customerOwnerId: string;
}) {
  // logger.info("start update_reqs_with_new_businessOwnerId");
  const reqs = await get_payment_requests_by_businessId(businessId);
  // logger.info("reqs.length: ", reqs.length);
  await Promise.all(
    reqs.map(async (req) => {
      // logger.info("req: ", req);
      const type = req.customerId === businessId ? "customerId" : "vendorId";
      const ownerType =
        req.customerId === businessId ? "customerOwnerId" : "vendorOwnerId";
      await supabase
        .from(TABLES.DocumentHeader)
        .update({
          [type]: newOwnerId,
          [ownerType]: customerOwnerId,
          guest_user: null,
        })
        .eq("id", req.id);
    })
  );
}

export async function check_if_business_belongs_to_userId(
  userId: string,
  businessId: number
) {
  console.log(userId, businessId)
  const { data: business } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("id", businessId)
    .single();
  return business?.ownerId === userId;
}

export async function check_if_business_belongs_to_creator(
  userId: string,
  businessId: number
) {
  const { data: business } = await supabase
    .from(TABLES.Business)
    .select()
    .eq("created_by", userId)
    .single();
  return business?.id === businessId;
}
export async function get_payment_request_by_uid({ uid }: { uid: string }) {
  const { data: vendorDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("vendorOwnerId", uid);

  const { data: customerDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("customerOwnerId", uid);

  const { data: guestDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("guest_user", uid);

  return uniqBy(
    [...(vendorDocs ?? []), ...(customerDocs ?? []), ...(guestDocs ?? [])],
    "id"
  );
}

export async function get_payment_requests_by_businessId(businessId: number) {
  const { data: vendorDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("vendorId", businessId);
  const { data: customerDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("customerId", businessId);
  return [...(vendorDocs ?? []), ...(customerDocs ?? [])];
}

export async function get_two_businesses_reqs(busi1: number, busi2: number) {
  const { data: vendorDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("vendorId", busi1)
    .eq("customerId", busi2);
  const { data: customerDocs } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("customerId", busi1)
    .eq("vendorId", busi2);
  return [...(vendorDocs ?? []), ...(customerDocs ?? [])];
}

export async function add_customer_to_business(
  customerId: number,
  businessId: number
) {
  const { data, error } = await supabase.from(TABLES.VendorCustomer).insert({
    vendorId: businessId,
    customerId: customerId,
    active: true,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function create_verification_code_for_payment_request({
  business,
  req,
}: {
  business: Business;
  req: any;
}) {
  const email_code = req.email_code || create_code();
  if (!req.email_to_verify || req.email_to_verify !== business.email) {
    const { error } = await supabase
      .from(TABLES.DocumentHeader)
      .update({ email_to_verify: business.email, email_code })
      .eq("id", req.id);
    if (error) {
      throw new Error(error.message);
    }
  }
  return email_code;
}

export async function get_business_by_id(id: number) {
  const { data } = await supabase.from(TABLES.Business).select().eq("id", id).single();
  if (!data) throw new NotFoundException("Not found business!");
  return data;
}

export async function get_payment_request_by_reqId(id: number) {
  const { data } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", id)
    .single();
  return data;
}

export async function get_businesses_by_customerId(id: number) {
  const { data: vendorCustomers } = await supabase
    .from(TABLES.VendorCustomer)
    .select()
    .eq("customer", id);
  if (!vendorCustomers) return [];

  const { data } = await supabase
    .from(TABLES.Business)
    .select()
    .in(
      "id",
      vendorCustomers.map((vendorCustomer) => vendorCustomer.vendor)
    );
  if (!data) throw new NotFoundException("Not found business!");

  return data;
}

export async function get_businesses_by_vendorId(id: number) {
  const { data: vendorCustomers } = await supabase
    .from(TABLES.VendorCustomer)
    .select()
    .eq("vendor", id);
  if (!vendorCustomers) return [];

  const { data } = await supabase
    .from(TABLES.Business)
    .select()
    .in(
      "id",
      vendorCustomers.map((vendorCustomer) => vendorCustomer.customer)
    );
  if (!data) throw new NotFoundException("Not found business!");

  return data;
}

export function create_code() {
  return Math.random().toString(36).slice(2, 8);
}
