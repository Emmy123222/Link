// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireAuth } from "../auth/authMiddleware.ts";
import { supabase } from "../config.ts";
import { general } from "../constants.ts";
import { TABLES } from "../db.ts";
import { fetchHTML, send_email } from "../email_sending/index.ts";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  handleException,
  MethodNotAllowedException,
  NotFoundException,
} from "../exceptions.ts";
import {
  add_customer_to_business,
  check_if_business_belongs_to_creator,
  check_if_business_belongs_to_userId,
  check_if_business_exists,
  check_if_email_is_in_business_with_owner,
  claim_ownership_on_business,
  create_business_by_other_user,
  create_business_manually,
  create_code,
  get_business_by_id,
  // get_businesses_by_customerId,
  // get_businesses_by_vendorId,
  get_payment_request_by_reqId,
  get_payment_requests_by_businessId,
  get_two_businesses_reqs,
} from "./business_helper.ts";
import { BusinessType } from "../types/business.ts";

// Helper function to get user ID from token
async function get_uid_by_token(token: string): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new ForbiddenException("Invalid token");
  if (!user) throw new ForbiddenException("User not found");
  return user.id;
}

Deno.serve((req) =>
  handleException(async () => {
    if (req.method == 'OPTIONS') return null;

    if (req.method == 'POST') {
      const { action, data } = await req.json();

      switch (action) {
        case "create_business":
          return create_business(data);
        case "update_business":
          return update_business(data);
        case "update_business_by_creator":
          return update_business_by_creator(data);
        case "get_business":
          return get_business(data);
        case "list_businesses":
          return list_businesses(data);
        case "delete_business":
          return delete_business(data);
        case "add_vendor":
          return add_vendor(req, data);
        case "update_business_address":
          return update_business_address(data);
        case "get_business_payment_requests":
          return get_business_payment_requests(data);
        case "get_business_customers":
          return get_business_customers(data);
        case "get_business_vendors":
          return get_business_vendors(data);
        case "update_business_settings":
          return update_business_settings(data);
        case "send_verify_code_to_email":
          return send_verify_code_to_email(data);
        case "send_business_verify_email":
          return send_business_verify_email(req, data);
        case "do_business_creation":
          return do_business_creation(data);
        case "verify_code_from_email":
          return verify_code_from_email(req, data);
        case "add_customer":
          return add_customer(req, data);
        case "delete_customer":
          return delete_customer(data);
        case "delete_vendor":
          return delete_vendor(data);
        case "deactivate_business":
          return deactivate_business(data);
        case "reactivate_business":
          return reactivate_business(data);
        case "take_ownership_over_business_from_pr":
          return take_ownership_over_business_from_pr(data);
        case "merge_businesses":
          return merge_businesses(data);
        case "get_business_payment_service":
          return get_business_payment_service(req, data);
        default:
          throw new BadRequestException(`Unknown action: ${action}`);
      }
    }
    throw new MethodNotAllowedException();
  })
);

const get_business_classifications = async () => {
  const { data, error } = await supabase.from(TABLES.BusinessCategory).select();
  if (error) throw new Error(error.message);
  return data.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.business_category }), {});
}

const send_verify_code_to_email = async (data: { email: string }) => {
  const { email } = data;
  const business_already_exists =
    await check_if_email_is_in_business_with_owner(email);
  if (business_already_exists) return { business_already_exists };
  // TODO: if verified don't send code.
  const email_code = create_code();
  const html = `<h3>here is your verification code for creating a business at Paylists.</h3>
<h1>${email_code}</h1>
<h3>if you didnt request for the code, dont do anything.</h3>`;
  await send_email({
    to: email,
    subject: "verification code",
    html,
  });
  return { sent: true };
};

const send_business_verify_email = async (req: Request, data: any) => {
  const { email, user_id } = data;
  const { supabase } = await requireAuth(req);
  const business_already_exists =
    await check_if_email_is_in_business_with_owner(email);
  if (business_already_exists)
    throw new ConflictException("Business already exists");
  const code = create_code();

  const { error: createVerifyEmailError } = await supabase.from(TABLES.VerifyEmail).insert({ user_id, email, code: code });
  if (createVerifyEmailError) throw new BadRequestException(createVerifyEmailError.message);
  const html = await fetchHTML(
    "verify_business_email",
    [
      {
        patternToReplace: "%%verify_url%%",
        replaceWith: "#",
      },
      {
        patternToReplace: "%%code%%",
        replaceWith: code,
      },
    ]
  );

  await send_email({
    to: email,
    subject: "Paylists Business Verification",
    business_name: "",
    senderBusinessName: "",
    html,
  });
  return { status: "success" };
}

const do_business_creation = async (data: { business: any; uid: string }) => {
  const { business, uid: userId } = data;
  let businessId = await handle_business_creation(business, userId);
  return { id: businessId };
};

const verify_code_from_email = async (req: Request, data: any) => {
  const { user, supabase } = await requireAuth(req);
  const { code, business } = data;

  const { data: emailVerification } = await supabase
    .from(TABLES.VerifyEmail)
    .select()
    .eq("email", business.email)
    .eq("code", code)
    .eq("user_id", business.ownerId)
    .single();

  if (!emailVerification) throw new NotFoundException("Verification code not found");

  if (emailVerification.code !== code) {
    throw new BadRequestException("Invalid verification code");
  }

  // await supabase
  //   .from(TABLES.VerifyEmail)
  //   .delete()
  //   .eq("id", emailVerification.id);

  const businessId = await handle_business_creation(business, business.ownerId);
  return { id: businessId };
};

const add_vendor = async (req: Request, { vendor, businessId, business_vendors }: { vendor: any; businessId: number; business_vendors: any[]; }) => {
  const { user, supabase } = await requireAuth(req);
  const userId = user.id;
  const belongsToUserId = await check_if_business_belongs_to_userId(
    userId,
    businessId
  );
  if (!belongsToUserId) return;
  const { existingBusiness } = await check_if_business_exists(vendor.email);
  if (existingBusiness && business_vendors.includes(existingBusiness.id)) {
    return {
      error: `Vendor with the same email address already exist (${existingBusiness.business_name})`,
    };
  }
  const vendorId =
    existingBusiness && !!existingBusiness.ownerId
      ? existingBusiness.id
      : (await create_business_by_other_user(vendor, userId)).id;
  await add_customer_to_business(businessId, vendorId);
  return { vendorId };
};

// Helper function to check if business is personal type
function isPersonalBusiness(businessType: string): boolean {
  return businessType === BusinessType.PERSONAL;
}

const add_customer = async (
  req: Request,
  {
    customer,
    businessId,
    business_customers,
  }: {
    customer: any;
    businessId: number;
    business_customers: any[];
  }
) => {
  const { supabase, user } = await requireAuth(req);
  const userId = user.id;
  const belongsToUserId = await check_if_business_belongs_to_userId(
    userId,
    businessId
  );
  if (!belongsToUserId) throw new ForbiddenException(`You don't have access to this business`);
  
  // Get business details to check type
  const business = await get_business_by_id(businessId);
  if (isPersonalBusiness(business.business_type)) {
    throw new ForbiddenException("Personal accounts cannot create customers. Please create a business account to access this feature.");
  }
  
  const { existingBusiness } = await check_if_business_exists(customer.email);
  if (
    existingBusiness &&
    business_customers &&
    business_customers.includes(existingBusiness.id)
  ) {
    return {
      error: `Customer with the same email address already exist (${existingBusiness.business_name})`,
    };
  }

  const customerId =
    existingBusiness && !!existingBusiness.ownerId
      ? existingBusiness.id
      : (await create_business_by_other_user(customer, userId)).id;
  await add_customer_to_business(customerId, businessId);
  return { customerId };
};

const delete_customer = async ({
  customerId,
  businessId,
  token,
}: {
  customerId: number;
  businessId: number;
  token: string;
}) => {
  const uid = await get_uid_by_token(token);
  const belongsToUserId = await check_if_business_belongs_to_userId(
    uid,
    businessId
  );
  if (!belongsToUserId) throw new ForbiddenException();
  const allReqs = await get_two_businesses_reqs(customerId, businessId);
  if (allReqs.length) return { haveReqs: true };
  
  // Soft delete: Mark the customer business as deleted instead of hard delete
  await supabase
    .from(TABLES.Business)
    .update({ 
      is_deleted: true,
      updated_by: uid
    })
    .eq("id", customerId);
    
  // Also remove the vendor-customer relationship
  await supabase
    .from(TABLES.VendorCustomer)
    .delete()
    .eq("vendorId", businessId)
    .eq("customerId", customerId);
    
  return { success: true };
};

const delete_vendor = async ({
  vendorId,
  businessId,
  token,
}: {
  vendorId: number;
  businessId: number;
  token: string;
}) => {
  const uid = await get_uid_by_token(token);
  const belongsToUserId = await check_if_business_belongs_to_userId(
    uid,
    businessId
  );
  if (!belongsToUserId) throw new ForbiddenException();
  const allReqs = await get_two_businesses_reqs(vendorId, businessId);
  if (allReqs.length) return { haveReqs: true };
  
  // Soft delete: Mark the vendor business as deleted instead of hard delete
  await supabase
    .from(TABLES.Business)
    .update({ 
      is_deleted: true,
      updated_by: uid
    })
    .eq("id", vendorId);
    
  // Also remove the vendor-customer relationship
  await supabase
    .from(TABLES.VendorCustomer)
    .delete()
    .eq("vendorId", vendorId)
    .eq("customerId", businessId);
    
  return { success: true };
};

const deactivate_business = async ({
  token,
  businessId,
}: {
  token: string;
  businessId: number;
}) => {
  const uid = await get_uid_by_token(token);
  const belongsToUserId = await check_if_business_belongs_to_userId(
    uid,
    businessId
  );
  if (!belongsToUserId) throw new ForbiddenException();
  await supabase
    .from(TABLES.Business)
    .update({ active: false })
    .eq("id", businessId);
  return { success: true };
};

const reactivate_business = async ({
  token,
  businessId,
}: {
  token: string;
  businessId: number;
}) => {
  const uid = await get_uid_by_token(token);
  const belongsToUserId = await check_if_business_belongs_to_userId(
    uid,
    businessId
  );
  if (!belongsToUserId) throw new ForbiddenException();
  await supabase
    .from(TABLES.Business)
    .update({ active: true })
    .eq("id", businessId);
  return { success: true };
};

const take_ownership_over_business_from_pr = async (data: any) => {
  const { token, code, reqId, businessId } = data;
  const uid = await get_uid_by_token(token);
  const { data: req } = await supabase
    .from(TABLES.DocumentHeader)
    .select()
    .eq("id", reqId)
    .single();
  if (!req) throw new NotFoundException("Not found request!");
  const { data: business } = await supabase
    .from(TABLES.VendorCustomer)
    .select()
    .eq("id", businessId)
    .single();
  if (!business) throw new NotFoundException("Not found business!");
  if (req.email_code != code || business.ownerId)
    throw new ForbiddenException();
  req.email_code = null;
  const isToPay = businessId === req.customerId;
  req[isToPay ? "customerOwnerId" : "vendorOwnerId"] = uid;
  business.ownerId = uid;
  await supabase.from(TABLES.DocumentHeader).update(req).eq("id", reqId);
  await supabase.from(TABLES.Business).update(business).eq("id", businessId);
  return { success: true };
};

const merge_businesses = async (data: any) => {
  const { token, mergeToId, mergeFromId, reqId } = data;
  const uid = await get_uid_by_token(token);
  const mergeFrom = await get_business_by_id(mergeFromId);
  const mergeTo = await get_business_by_id(mergeToId);
  if (mergeFrom.ownerId || mergeTo.ownerId !== uid)
    throw new BadRequestException();

  const req = await get_payment_request_by_reqId(reqId);
  const isToPay = mergeFromId === req.customerId;

  // Update the payment request
  await supabase
    .from(TABLES.DocumentHeader)
    .update({
      [isToPay ? "customerOwnerId" : "vendorOwnerId"]: uid,
      email_code: null,
      email_to_verify: null,
    })
    .eq("id", reqId);

  // Update all payment requests
  const allReqs = await get_payment_requests_by_businessId(mergeFromId);
  await Promise.all(
    allReqs.map((req) => {
      return supabase
        .from(TABLES.DocumentHeader)
        .update({ [isToPay ? "customerId" : "vendorId"]: mergeToId })
        .eq("id", req.id);
    })
  );

  // Update vendor-customer relationships
  const { data: vendorCustomers } = await supabase
    .from(TABLES.VendorCustomer)
    .select()
    .or(`vendor.eq.${mergeFromId},customer.eq.${mergeFromId}`);

  if (vendorCustomers) {
    await Promise.all(
      vendorCustomers.map(async (vc) => {
        if (vc.vendor === mergeFromId) {
          await supabase
            .from(TABLES.VendorCustomer)
            .update({ vendor: mergeToId })
            .eq("id", vc.id);
        } else if (vc.customer === mergeFromId) {
          await supabase
            .from(TABLES.VendorCustomer)
            .update({ customer: mergeToId })
            .eq("id", vc.id);
        }
      })
    );
  }

  // Delete the merged business
  await supabase
    .from(TABLES.Business)
    .delete()
    .eq("id", mergeFromId);

  return { success: true };
};

async function handle_business_creation(business: any, userId: string) {
  const { businesses } = await check_if_business_exists(business.email);
  let businessId;
  if (businesses.length >= 1) {
    businessId = (
      await claim_ownership_on_business(business, userId)
    ).id;
  } else {
    businessId = (await create_business_manually(business, userId)).id;
  }
  const linkUserToBusiness = await supabase.from(TABLES.UserBusiness).insert({
    id: userId,
    business: businessId,
    active: true
  });
  if (linkUserToBusiness.error) {
    await supabase.from(TABLES.Business).delete().eq('id', businessId);
    throw new Error(linkUserToBusiness.error.message)
  };
  return businessId;

}

async function create_business(data: any) {
  const { business, userId } = data;
  return do_business_creation({ business, uid: userId });
}

async function update_business(data: any) {
  const { businessId, updates, token } = data;
  const userId = await get_uid_by_token(token);
  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();
  const { data: updatedBusiness, error } = await supabase
    .from(TABLES.Business)
    .update(updates)
    .eq('id', businessId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { business: updatedBusiness };
}

async function update_business_by_creator(data: any) {
  const { businessId, updates } = data;
  const { data: updatedBusiness, error } = await supabase
    .from(TABLES.Business)
    .update(updates)
    .eq('id', businessId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { business: updatedBusiness };
}

async function get_business(data: any) {
  const { businessId, token } = data;
  const userId = await get_uid_by_token(token);

  const business = await get_business_by_id(businessId);
  if (!business) throw new NotFoundException("Business not found");

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  return { business };
}

async function list_businesses(data: any) {
  const { token } = data;
  const userId = await get_uid_by_token(token);
  const { data: businesses, error } = await supabase
    .from(TABLES.UserBusiness)
    .select('*, business(*, countryCode)')
    .eq('id', userId);
  if (error) throw new Error(error.message);
  
  // Filter out deleted businesses
  return businesses
    .map(item => item.business)
    .filter(business => !business.is_deleted);
}

async function delete_business(data: any) {
  const { businessId, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  // Check for existing payment requests
  const requests = await get_payment_requests_by_businessId(businessId);
  if (requests.length > 0) {
    throw new BadRequestException("Cannot delete business with existing payment requests");
  }

  // Soft delete: Mark business as deleted instead of hard delete
  const { error } = await supabase
    .from(TABLES.Business)
    .update({ 
      is_deleted: true,
      updated_by: userId
    })
    .eq('id', businessId);

  if (error) throw new Error(error.message);
  return { success: true };
}

async function update_business_address(data: any) {
  const { businessId, address, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  const { data: updatedAddress, error } = await supabase
    .from('addresses')
    .upsert({
      ...address,
      business_id: businessId
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { address: updatedAddress };
}

async function get_business_payment_requests(data: any) {
  const { businessId, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  const requests = await get_payment_requests_by_businessId(businessId);
  return { requests };
}

async function get_business_customers(data: any) {
  const { businessId, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  const { data: relationships, error } = await supabase
    .from(TABLES.VendorCustomer)
    .select(`
      customer:customerId (*, countryCode(*))
    `)
    .eq('vendorId', businessId);

  if (error) throw new Error(error.message);
  
  // Filter out deleted customers
  return relationships
    .map(r => r.customer)
    .filter(customer => !customer.is_deleted);
}

async function get_business_vendors(data: any) {
  const { businessId, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  const { data: relationships, error } = await supabase
    .from(TABLES.VendorCustomer)
    .select(`
      vendor:vendorId (*)
    `)
    .eq('customerId', businessId);

  if (error) throw new Error(error.message);
  
  // Filter out deleted vendors
  return relationships
    .map(r => r.vendor)
    .filter(vendor => !vendor.is_deleted);
}

async function update_business_settings(data: any) {
  const { businessId, settings, token } = data;
  const userId = await get_uid_by_token(token);

  const belongsToUser = await check_if_business_belongs_to_userId(userId, businessId);
  if (!belongsToUser) throw new ForbiddenException();

  const { data: updatedBusiness, error } = await supabase
    .from(TABLES.Business)
    .update({
      payment_terms: settings.payment_terms,
      payment_request_tax: settings.payment_request_tax,
      currency: settings.currency,
      partial_payments: settings.partial_payments,
      payment_integration: settings.payment_integration,
      accounting_integration: settings.accounting_integration
    })
    .eq('id', businessId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { business: updatedBusiness };
}

const get_business_payment_service = async (req: Request, data: { businessId: string }) => {
  const { supabase } = await requireAuth(req);
  const { data: paymentServices, error } = await supabase.from(TABLES.PaymentServices).select('*').eq('business_id', data.businessId);

  if (error)
    throw new Error(error.message);

  return paymentServices;
}
