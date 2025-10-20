"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';


interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
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

    const fetchProfileWithTimeout = async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await Promise.race([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timed out after 10 seconds.")), 10000)
          )
        ]);

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("SessionContextProvider: Supabase error fetching profile:", error);
          return null;
        }
        return data as Profile | null;
      } catch (e: any) {
        console.error("SessionContextProvider: Error or timeout during profile fetch:", e);
        return null; // Return null on timeout or other errors
      }
    };

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
        const fetchedProfile = await fetchProfileWithTimeout(userId);
        
        if (fetchedProfile) {
          console.log("SessionContextProvider: Profile data fetched:", fetchedProfile);
          setProfile(fetchedProfile);
          setIsAdmin(fetchedProfile.is_admin || false);
        } else {
          console.warn("SessionContextProvider: Profile not found or fetch failed for user ID:", userId);
          // Profile and isAdmin remain null/false as initialized
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

    // The onAuthStateChange 'INITIAL_SESSION' event should cover the initial load.
    // Explicitly fetching initial session here is redundant and can cause race conditions.
    // Removed: getInitialSession();

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