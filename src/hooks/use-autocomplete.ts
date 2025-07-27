import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AddressSuggestion, Company } from '@/types/country';
import { toast } from 'react-toastify';

interface CompanyResult {
  items: Company[];
}

export const useAutoCompleteCompany = () => {
  return useMutation<CompanyResult, Error, string>({
    mutationFn: async (value: string) => {
      if (!value) {
        throw new Error("Company name is required");
      }

      // Use our proxy API route instead of direct API call
      const result = await axios.get(`/api/company-search?q=${encodeURIComponent(value)}`);

      return result.data
    },
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      console.error('Company API Error:', error);
      toast.error(`Company search failed: ${error.message}`);
    },
  });
};


interface AddressResult {
  latitude: string;
  longitude: string;
  suggestions: AddressSuggestion[];
}

export const useAutoCompleteAddress = () => {
  return useMutation<AddressResult, Error, string>({
    mutationFn: async (value: string) => {
      if (!value) {
        throw new Error("Postcode is required");
      }

      // Check if this is an autocomplete request or a specific address request
      const isAutocomplete = !value.startsWith('get/');
      const endpoint = isAutocomplete ? `autocomplete/${value}` : value;
      
      const response = await axios.get<AddressResult>(
        `https://api.getAddress.io/${endpoint}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );

      return response.data;
    },
    onError: (error: Error) => {
      console.error('Address API Error:', error);
      console.error('API Key exists:', !!process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY);
      toast.error(`Address search failed: ${error.message}`);
    },
  });
};
