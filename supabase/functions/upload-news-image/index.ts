// @ts-ignore
declare const Deno: any;

// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET');

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
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
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function generateCloudinarySignature(params: Record<string, string | number>): Promise<string> {
  const sortedParams = Object.keys(params).sort()
    .map(key => `${key}=${String(params[key])}`)
    .join('&');
  const toSign = `${sortedParams}${CLOUDINARY_API_SECRET?.trim()}`;
  const hashBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: corsHeaders });

  // CHECK ROLE: Verify user is an admin in the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403, headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const timestamp = Math.floor(Date.now() / 1000);

    if (action === 'upload') {
      const { base64Data, folder } = data;
      const signature = await generateCloudinarySignature({ timestamp, folder });
      
      const formData = new FormData();
      formData.append('file', base64Data);
      formData.append('api_key', CLOUDINARY_API_KEY!);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const result = await res.json();
      return new Response(JSON.stringify({ publicUrl: result.secure_url, publicId: result.public_id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } 
    
    if (action === 'delete') {
      const { publicId } = data;
      const signature = await generateCloudinarySignature({ public_id: publicId, timestamp });
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', CLOUDINARY_API_KEY!);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, { method: 'POST', body: formData });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: corsHeaders });
  }
});