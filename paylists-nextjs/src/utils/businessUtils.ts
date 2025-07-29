import { Business, BusinessType } from '@/types/business';

/**
 * Check if a business is a personal type that cannot create customers or send invoices
 */
export function isPersonalBusiness(business: Business | null | undefined): boolean {
  if (!business) return false;
  return business.business_type === BusinessType.PERSONAL;
}

/**
 * Check if a business can create customers (i.e., it's not a personal business)
 */
export function canCreateCustomers(business: Business | null | undefined): boolean {
  return !isPersonalBusiness(business);
}

/**
 * Check if a business can send invoices or payment requests (i.e., it's not a personal business)
 */
export function canSendInvoices(business: Business | null | undefined): boolean {
  return !isPersonalBusiness(business);
}

/**
 * Check if a business has full business functionality
 */
export function hasFullBusinessFunctionality(business: Business | null | undefined): boolean {
  return canCreateCustomers(business) && canSendInvoices(business);
}

/**
 * Get business type display name for UI
 */
export function getBusinessTypeDisplayName(business: Business | null | undefined): string {
  if (!business) return 'Unknown';
  
  if (isPersonalBusiness(business)) {
    return 'Personal Account';
  }
  
  return 'Business Account';
}

/**
 * Get restricted features message for personal businesses
 */
export function getPersonalBusinessRestrictionsMessage(): string {
  return 'Personal accounts can only receive and pay invoices. To create customers and send invoices, please create a business account.';
} 