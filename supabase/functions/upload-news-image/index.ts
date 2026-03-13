// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// @ts-ignore
const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
// @ts-ignore
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY');
// @ts-ignore
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET');

// @ts-ignore
const supabase = createClient(
  // @ts-ignore
  Deno.env.get('SUPABASE_URL') ?? '',
  // @ts-ignore
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, content-disposition',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 
  'Access-Control-Max-Age': '86400',
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

// Utility to generate Cloudinary signature
async function generateCloudinarySignature(params: Record<string, string | number>): Promise<string> {
  if (!CLOUDINARY_API_SECRET) {
    console.error("[upload-news-image] Error: CLOUDINARY_API_SECRET is not configured.");
    throw new Error("Cloudinary API Secret not configured.");
  }
  
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = sortedKeys
    .filter((key) => params[key])
    .map(key => `${key}=${String(params[key])}`)
    .join('&');

  const toSign = `${sortedParams}${CLOUDINARY_API_SECRET.trim()}`;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(toSign)
  );
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return signature;
}

// Utility to upload base64 data to Cloudinary
async function uploadToCloudinary(base64Data: string, folder: string) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error("[upload-news-image] Cloudinary credentials missing during upload attempt.");
    throw new Error("Cloudinary credentials missing.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    timestamp: timestamp,
    folder: folder,
  };

  const signature = await generateCloudinarySignature(params);

  // @ts-ignore
  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.statusText}. Details: ${errorText}`);
  }

  return response.json();
}

// Utility to delete image from Cloudinary
async function deleteFromCloudinary(publicId: string) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error("[upload-news-image] Cloudinary credentials missing during delete attempt.");
    throw new Error("Cloudinary credentials missing.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    public_id: publicId,
    timestamp: timestamp,
  };

  const signature = await generateCloudinarySignature(params);

  // @ts-ignore
  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary deletion failed: ${response.statusText}. Details: ${errorText}`);
  }

  return response.json();
}


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error("[upload-news-image] Unauthorized: Missing Authorization header");
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    console.error("[upload-news-image] Unauthorized: Invalid token or user", { userError });
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token or user' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { action, data } = await req.json();

    if (action === 'upload') {
      const { base64Data, folder } = data;
      if (!base64Data || !folder) {
        return new Response(JSON.stringify({ error: 'Missing base64Data or folder for upload.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Enforce 2MB size limit on the server side
      // Base64 is roughly 33% larger than binary data.
      const base64Content = base64Data.split(',')[1] || base64Data;
      const approxSizeInBytes = (base64Content.length * 3) / 4;

      if (approxSizeInBytes > MAX_FILE_SIZE) {
        console.warn("[upload-news-image] Rejecting upload: File too large", { approxSizeInBytes });
        return new Response(JSON.stringify({ 
          error: `File size exceeds the 2MB limit.` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const result = await uploadToCloudinary(base64Data, folder);
      
      if (result.error) {
        throw new Error(result.error.message || "Cloudinary upload failed.");
      }

      console.log("[upload-news-image] Successful upload", { publicId: result.public_id });
      return new Response(JSON.stringify({ 
        publicUrl: result.secure_url,
        publicId: result.public_id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    if (action === 'delete') {
      const { publicId } = data;
      if (!publicId) {
        return new Response(JSON.stringify({ error: 'Missing publicId for deletion.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const result = await deleteFromCloudinary(publicId);
      
      if (result.error) {
        throw new Error(result.error.message || "Cloudinary deletion failed.");
      }

      console.log("[upload-news-image] Successful deletion", { publicId });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action specified.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("[upload-news-image] Edge Function Error:", error);
    const status = (error as Error).message.includes("Unauthorized") ? 401 : 500;
    
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});