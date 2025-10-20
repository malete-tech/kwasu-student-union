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
  const [loading, setLoading] = useState<boolean>(true); // Start as true

  useEffect(() => {
    console.log("SessionContextProvider: Initializing auth state listener.");

    const handleAuthEvent = async (event: string, newSession: Session | null) => {
      console.log(`SessionContextProvider: Processing auth event: ${event}. New session: ${newSession ? "present" : "null"}.`);
      setLoading(true); // Always set loading true at the start of an auth event processing

      setSession(newSession);
      setUser(newSession?.user || null);
      setProfile(null); // Reset profile and isAdmin until re-fetched
      setIsAdmin(false);

      if (newSession?.user) {
        const userId = newSession.user.id;
        console.log("SessionContextProvider: User present. Attempting to fetch profile for user ID:", userId);

        const profileFetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timed out after 10 seconds.")), 10000)
        );

        try {
          const result = await Promise.race([profileFetchPromise, timeoutPromise]) as SupabaseProfileQueryResult;
          if (result.data) {
            console.log("SessionContextProvider: Profile data fetched:", result.data);
            setProfile(result.data);
            setIsAdmin(result.data.is_admin || false);
          } else if (result.error && result.error.code === 'PGRST116') {
            console.warn("SessionContextProvider: No profile found for user ID:", userId);
          } else if (result.error) {
            console.error("SessionContextProvider: Supabase error fetching profile:", result.error);
          }
        } catch (e: any) {
          console.error("SessionContextProvider: Error or timeout during profile fetch:", e);
          // If timeout or other error, profile and isAdmin remain null/false as set above
        }
      } else {
        console.log("SessionContextProvider: No user in session. Profile and isAdmin remain null/false.");
      }
      console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
      setLoading(false); // Set loading false only after all profile logic is done
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        await handleAuthEvent(event, newSession);
      }
    );

    // Also fetch initial session explicitly to ensure state is set on first load
    // This is important for cases where onAuthStateChange 'INITIAL_SESSION' might not fire immediately
    // or if the component mounts after it has fired.
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession) {
        await handleAuthEvent('INITIAL_SESSION_FETCH', initialSession);
      } else {
        await handleAuthEvent('INITIAL_SESSION_FETCH', null);
      }
    };
    getInitialSession();


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
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};