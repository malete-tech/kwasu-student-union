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

interface SupabaseProfileQueryResult {
  data: Profile | null;
  error: PostgrestError | null;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("SessionContextProvider: Initializing auth state listener.");

    const handleSessionChange = async (newSession: Session | null, event: string) => {
      console.log(`SessionContextProvider: Processing auth event: ${event}. New session: ${newSession ? "present" : "null"}.`);
      setLoading(true); // Set loading true while processing session change

      try {
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          const userId = newSession.user.id;
          console.log("SessionContextProvider: User present. Attempting to fetch profile for user ID:", userId);

          const profileFetchPromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          // Increased timeout to 10 seconds
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timed out after 10 seconds.")), 10000)
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
        console.error("SessionContextProvider: Unexpected error during session change processing:", e);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      } finally {
        console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Only process if the session actually changed or it's an initial session event
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
          await handleSessionChange(newSession, event);
        }
      }
    );

    return () => {
      console.log("SessionContextProvider: Cleaning up auth state change subscription.");
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <SessionContext.Provider value={{ session, user, profile, isAdmin, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};