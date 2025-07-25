export const PUBLIC_IMAGES = {
  // Logos
  logo: '/logo.svg',
  placeholderLogo: '/placeholder-logo.svg',
  shortLogo: '/short.png',

  // Icons
  window: '/window.svg',
  file: '/file.svg',
  globe: '/globe.svg',

  // Default placeholder images
  defaultUser: '/images/user.svg',
  defaultCustomer: '/images/customer.svg',
  defaultVendor: '/images/vendor.svg',
  defaultBusiness: '/images/company.svg',

  // Illustrations
  registration: '/images/registration.svg',
  business: '/images/business.svg',
  products: '/images/products.svg',
  accounting: '/images/accounting.svg',
  paymentWelcome: '/images/payment-welcome.svg',
  accountPhone: '/images/account-phone.svg',
  verificationSent: '/images/verification-sent.svg',
  addVendor: '/images/add-vendor.svg',
  onboardingDone: '/images/onboarding-done.svg',
} as const

export type PublicImageKey = keyof typeof PUBLIC_IMAGES

export const getPublicImageUrl = (key: PublicImageKey) => {
  return PUBLIC_IMAGES[key]
}

export const getPublicImageProps = (key: PublicImageKey) => {
  const src = PUBLIC_IMAGES[key]
  const isSvg = src.endsWith('.svg')

  return {
    src,
    priority: key === 'logo' || key === 'shortLogo',
    loading: isSvg ? undefined : "lazy" as const,
    optimize: !isSvg,
  }
} 