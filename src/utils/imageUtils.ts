import { PUBLIC_IMAGES } from '@/lib/utils/public-image';
import { BusinessType } from '@/types/business';

export type ImageEntityType = 'user' | 'business' | 'customer' | 'vendor';

/**
 * Get the appropriate default image URL for different entity types
 */
export function getDefaultImageUrl(type: ImageEntityType): string {
  switch (type) {
    case 'user':
      return PUBLIC_IMAGES.defaultUser;
    case 'customer':
      return PUBLIC_IMAGES.defaultCustomer;
    case 'vendor':
      return PUBLIC_IMAGES.defaultVendor;
    case 'business':
      return PUBLIC_IMAGES.defaultBusiness;
    default:
      return PUBLIC_IMAGES.defaultUser;
  }
}

/**
 * Determine entity type based on business type or context
 */
export function getEntityTypeFromBusinessType(businessType?: BusinessType | string): ImageEntityType {
  if (!businessType) return 'business';
  
  // Personal accounts are treated as users
  if (businessType === BusinessType.PERSONAL || businessType === 'Personal') {
    return 'user';
  }
  
  // All other business types are treated as businesses
  return 'business';
}

/**
 * Get default image URL based on business type
 */
export function getDefaultImageForBusinessType(businessType?: BusinessType | string): string {
  const entityType = getEntityTypeFromBusinessType(businessType);
  return getDefaultImageUrl(entityType);
}

/**
 * Get a fallback image URL if the primary image fails to load
 */
export function getImageWithFallback(primarySrc: string | null | undefined, entityType: ImageEntityType): string {
  return primarySrc || getDefaultImageUrl(entityType);
} 