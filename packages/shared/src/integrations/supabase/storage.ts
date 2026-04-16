import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const uploadImage = async (
  file: File,
  bucketName: string,
  folderPath: string,
): Promise<string | null> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folderPath}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    toast.error(`Image upload failed: ${uploadError.message}`);
    return null;
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteImage = async (
  url: string,
  bucketName: string,
  folderPath: string,
): Promise<boolean> => {
  if (!url) return true; // Nothing to delete

  const pathSegments = url.split('/');
  const fileName = pathSegments[pathSegments.length - 1];
  const filePath = `${folderPath}/${fileName}`;

  const { error: deleteError } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (deleteError) {
    console.error("Error deleting image:", deleteError);
    toast.error(`Image deletion failed: ${deleteError.message}`);
    return false;
  }
  return true;
};