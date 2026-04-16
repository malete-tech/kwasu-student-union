import { Profile } from "../../types";
import { supabase } from "../../integrations/supabase/client";

export const profiles = {
  getById: async (id: string): Promise<Profile | undefined> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching profile by ID:", error);
      if (error.code === 'PGRST303' || error.message?.includes('JWT expired')) {
        // Force re-login if session is expired
        supabase.auth.signOut().then(() => {
          window.location.href = '/login';
        });
      }
      throw new Error(error.message);
    }

    if (!data) return undefined;

    return data as Profile;
  },

  update: async (id: string, profile: Partial<Omit<Profile, 'id' | 'updated_at'>>): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating profile:", error);
      if (error.code === 'PGRST303' || error.message?.includes('JWT expired')) {
        // Force re-login if session is expired
        supabase.auth.signOut().then(() => {
          window.location.href = '/login';
        });
      }
      throw new Error(error.message);
    }

    return data as Profile;
  }
};
