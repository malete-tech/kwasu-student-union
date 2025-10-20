import { supabase } from "./client";

export const uploadImage = async (file: File, bucketName: string, path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

export const deleteImage = async (bucketName: string, path: string): Promise<void> => {
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};