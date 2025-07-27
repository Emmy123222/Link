import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, sendResetPasswordEmail, sendSms, verifyPhone } from "@/lib/supabase/auth";
import { User } from "@/types/user";
import { toast } from "react-toastify";
import { updateProfile } from "@/lib/supabase/profile";
import { PhoneVerificationData } from "@/types/phone";
import { uploadFile } from "@/lib/supabase/uploadFile";
import { handleApiCall } from "@/lib/utils/api";
import { supabase } from "@/lib/supabaseClient";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => await getUser()
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (profile: Partial<User>) => await handleApiCall(
      async () => await updateProfile(profile),
      {
        loadingMessage: 'Updating profile...',
        successMessage: 'Profile updated successfully',
        errorMessage: 'Failed to update profile'
      }
    ),
    onSuccess: (data) => {
      return data;
    },
    onError: (error: Error) => {
      console.log(error.message)
    },
  });
}

export const useSendSms = () => {
  return useMutation({
    mutationFn: async (phone: string) => await handleApiCall(
      async () => {
        const data = await sendSms(phone);
        return data;
      },
      {
        loadingMessage: 'Sending SMS...',
        successMessage: 'SMS sent successfully',
        errorMessage: 'Failed to send SMS'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
      return false;
    },
  })
}

export const useSendResetPasswordEmail = () => {
  return useMutation({
    mutationFn: async ({ userEmail }: { userEmail: string }) => {
      return handleApiCall(
        async () => {
          const data = await sendResetPasswordEmail({ userEmail });
          return { data };
        },
        {
          loadingMessage: 'Sending reset password email...',
          successMessage: 'Reset password email sent',
          errorMessage: 'Failed to send reset password email'
        }
      )
    },
  });
}

export const usePhoneVerify = () => {
  return useMutation({
    mutationFn: async (phoneCode: PhoneVerificationData) => await handleApiCall(
      async () => {
        const data = await verifyPhone(phoneCode);
        return true;
      },
      {
        loadingMessage: 'Verifying phone...',
        successMessage: 'Phone verified',
        errorMessage: 'Failed to verify phone'
      }
    ),
    onSuccess: (data) => {
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  });
}

export const useSendProfileImage = () => {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      return await uploadFile(file, userId)
    },
    onSuccess: (url) => {
      console.log("Uploaded image URL:", url)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { newPassword: string }) => await handleApiCall(
      async () => {
        const { error } = await supabase.auth.updateUser({ password: data.newPassword })
        return error
      },
      {
        loadingMessage: 'Changing password...',
        successMessage: 'Password changed successfully',
        errorMessage: 'Failed to change password'
      }
    ),
    onSuccess: (data) => {
      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}