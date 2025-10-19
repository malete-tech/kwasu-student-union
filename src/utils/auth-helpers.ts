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

export const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    toast.error(error.message);
    return false;
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    toast.error("Account with this email already exists. Please sign in.");
    return false;
  }

  toast.success("Registration successful! Please check your email to confirm your account.");
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