import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    toast.error(error.message);
    return false;
  }
  toast.success("Signed in successfully!");
  return true;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/update-password`, // Redirect to a page where user can set new password
  });

  if (error) {
    toast.error(error.message);
    return false;
  }
  toast.success("Password reset email sent! Please check your inbox.");
  return true;
};