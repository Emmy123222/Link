import { supabase } from "../supabaseClient"

export const uploadFile = async (file: File, userId: string) => {
  if (!file) throw new Error("No file provided")
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}.${fileExt}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatar")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // overwrite if same file
    })

  console.log(uploadError)
  if (uploadError) throw uploadError

  // Get public URL
  const { data } = supabase.storage
    .from("avatar")
    .getPublicUrl(filePath)

  return data.publicUrl
}
