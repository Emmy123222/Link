export type Country = {
  ID: number
  countryName: string
  icon: string
  countryCode: string
  phone_code: PhoneCode
  created_at: string
}

export type PhoneCode = {
  id: number
  created_at: string
  country: string
  phone_code: string
}
export type AddressSuggestion = {
  address: string
  id: string
  url: string
}
export type Address = {
  postcode: string
  latitude: number
  longitude: number
  formatted_address: string
  thoroughfare: string
  building_name: string
  sub_building_name: string
  sub_building_number: string
  building_number: string
  line_1: string
  line_2: string
  line_3: string
  line_4: string
  locality: string
  town_or_city: string
  county: string
  district: string
  country: string
  residential: boolean
}

export type CompanyAddress = {
  address_line_2: string
  postal_code: string
  locality: string
  address_line_1: string
  region: string
  country: string
}

export type Company = {
  company_status: string
  matches: {
    snippet: string[]
  }
  date_of_creation: string
  date_of_cessation: string
  kind: string
  address_snippet: string
  links: {
    self: string
  }
  address: CompanyAddress
  title: string
  snippet: string
  description: string
  company_type: string
  description_identifier: string[]
  company_number: string
  external_registration_number: string
}