import { toast } from "sonner";

// NOTE: This URL must be hardcoded with your Supabase Project ID
const CLOUDINARY_EDGE_FUNCTION_URL = `https://hblljnhofvcflilawtkn.supabase.co/functions/v1/upload-news-image`;

// Utility to convert File to Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Utility to extract Cloudinary Public ID from URL
export const getCloudinaryPublicId = (url: string): string | null => {
  // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/public_id.ext
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  
  const path = parts[1]!;
  // Remove version number (v123456789/) and extension (.ext)
  const publicIdWithExt = path.split('/').slice(1).join('/');
  const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
  
  return publicId;
};


interface UploadResult {
  publicUrl: string;
  publicId: string;
}

export const uploadImageToCloudinary = async (
  file: File,
  folder: string,
  token: string,
): Promise<UploadResult | null> => {
  try {
    const base64Data = await fileToBase64(file);

    const response = await fetch(CLOUDINARY_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: 'upload',
        data: {
          base64Data,
          folder,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "Upload failed on the server.");
    }

    return result as UploadResult;
  } catch (error) {
    console.error("Error uploading image via Edge Function:", error);
    toast.error(`Image upload failed: ${(error as Error).message}`);
    return null;
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string,
  token: string,
): Promise<boolean> => {
  try {
    const response = await fetch(CLOUDINARY_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: 'delete',
        data: {
          publicId,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "Deletion failed on the server.");
    }

    return true;
  } catch (error) {
    console.error("Error deleting image via Edge Function:", error);
    toast.error(`Image deletion failed: ${(error as Error).message}`);
    return false;
  }
};