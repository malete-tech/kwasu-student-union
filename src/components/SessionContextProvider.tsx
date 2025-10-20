"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { PostgrestError } from '@supabase/supabase-js';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
}

// Define a type for the expected result from the Supabase profile fetch
interface SupabaseProfileQueryResult {
  data: Profile | null;
  error: PostgrestError | null;
}

// Provide a default object to createContext that matches SessionContextType
const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false, // Default to false
  loading: true,  // Default to true
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("SessionContextProvider: Initializing auth state listener.");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`SessionContextProvider: Auth state change event: ${event}. Setting loading to true.`);
        setLoading(true); // Always set loading to true at the start of an auth state change

        try {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            const userId = newSession.user.id;
            console.log("SessionContextProvider: Attempting to fetch profile for user ID:", userId);

            const profileFetchPromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Profile fetch timed out after 5 seconds.")), 5000)
            );

            let profileData: Profile | null = null;
            let profileError: PostgrestError | Error | null = null;

            try {
              const result = await Promise.race([profileFetchPromise, timeoutPromise]) as SupabaseProfileQueryResult;
              profileData = result.data;
              profileError = result.error;
            } catch (e: any) {
              profileError = e instanceof Error ? e : new Error(String(e));
              console.error("SessionContextProvider: Error or timeout during profile fetch:", e);
            }
            
            if (profileError) {
              if (profileError instanceof PostgrestError && profileError.code === 'PGRST116') {
                console.warn("SessionContextProvider: No profile found for user ID:", userId);
              } else {
                console.error("SessionContextProvider: Supabase error fetching profile:", profileError);
              }
              setProfile(null);
              setIsAdmin(false);
            } else if (profileData) {
              console.log("SessionContextProvider: Profile data fetched:", profileData);
              setProfile(profileData);
              setIsAdmin(profileData.is_admin || false);
            } else {
              console.log("SessionContextProvider: Profile data was null/undefined after fetch. Setting isAdmin to false.");
              setProfile(null);
              setIsAdmin(false);
            }
          } else {
            console.log("SessionContextProvider: No user in session. Resetting profile and isAdmin.");
            setProfile(null);
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("SessionContextProvider: Unexpected error during auth state change processing:", e);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } finally {
          console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log("SessionContextProvider: Cleaning up auth state change subscription.");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, user, profile, isAdmin, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    // This error should ideally not be thrown with the default value provided to createContext
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};