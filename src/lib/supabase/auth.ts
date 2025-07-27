import { supabase } from '@/lib/supabaseClient'
import { serv_create_doc_after_registration, serv_create_user, serv_get_user_by_id, serv_reset_password_email, serv_send_phone_verification_sms, serv_send_verify_email, serv_verify_phone_code } from './functions'
import { PhoneVerificationData } from '@/types/phone'

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const signUp = async (email: string, password: string) => {
  try {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback' // fallback for SSR
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo
      }
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export const createAccount = async (email: string, password: string) => {
  try {
    const { data, error } = await serv_create_user({
      email,
      password
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Create account error:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export const afterSignUp = async (data: { id: string, email: string }) => {
  try {
    return await serv_create_doc_after_registration(data)
  } catch (error) {
    console.error('After signup error:', error)
    throw error
  }
}


export const getUser = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) {
      throw new Error("No active session")
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) throw authError ?? new Error("No user returned")

    const { data: user, error: getUserError } = await serv_get_user_by_id(authData.user.id)
    if (getUserError) throw getUserError
    if (!user) throw new Error("No user returned")
    return user
  } catch (error) {
    throw error
  }
}

export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // allows overwriting
    });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

export const sendSms = async (phone: string) => {
  const { data, error } = await serv_send_phone_verification_sms(phone);
  if (error) throw error;
  return data
}

export const verifyPhone = async (phoneCode: PhoneVerificationData) => {
  const { data, error } = await serv_verify_phone_code(phoneCode);
  if (error) throw error;
  return data
}

export const sendVerifyEmail = async ({ userEmail }: { userEmail: string }) => {
  const { data, error } = await serv_send_verify_email({ userEmail });
  if (error) throw error;
  return data
}

export const sendResetPasswordEmail = async (email: { userEmail: string }) => {
  console.log(email)
  const { data, error } = await serv_reset_password_email(email);
  if (error) throw error;
  return data
}

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}