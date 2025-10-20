"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean; // Indicates if the initial auth state check is complete
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  loading: true, // Start as true, indicating we are checking auth state
});

// Define a timeout for profile fetching (e.g., 10 seconds)
const PROFILE_FETCH_TIMEOUT_MS = 10000; 

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // True until initial check is done

  const fetchProfileWithTimeout = useCallback(async (userId: string): Promise<Profile | null> => {
    const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => {
        console.warn(`SessionContextProvider: Profile fetch timed out after ${PROFILE_FETCH_TIMEOUT_MS / 1000} seconds for user ID: ${userId}`);
        resolve(null); // Resolve with null on timeout
      }, PROFILE_FETCH_TIMEOUT_MS)
    );

    try {
      const result = await Promise.race([profilePromise, timeoutPromise]);

      if (result === null) {
        return null; // Timeout occurred
      }

      const { data, error } = result; // Destructure data and error from the resolved promise

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("SessionContextProvider: Supabase error fetching profile:", error);
        return null;
      }
      return data as Profile | null;
    } catch (e: any) {
      console.error("SessionContextProvider: Error fetching profile:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    console.log("SessionContextProvider: Setting up auth state change subscription.");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`SessionContextProvider: Auth event: ${event}. New session: ${newSession ? "present" : "null"}`);
        
        // Always set loading to true at the start of processing a new auth event
        setLoading(true); 

        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);

          console.log("SessionContextProvider: User present. Attempting to fetch profile for user ID:", newSession.user.id);
          const fetchedProfile = await fetchProfileWithTimeout(newSession.user.id);
          
          if (fetchedProfile) {
            console.log("SessionContextProvider: Profile data fetched:", fetchedProfile);
            setProfile(fetchedProfile);
            setIsAdmin(fetchedProfile.is_admin || false);
          } else {
            console.warn("SessionContextProvider: Profile not found or fetch failed for user ID:", newSession.user.id);
            setProfile(null);
            setIsAdmin(false);
          }
        } else {
          // User signed out or no session
          console.log("SessionContextProvider: No user in session. Clearing state.");
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        // After all async operations for this auth event are complete, set loading to false
        console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
        setLoading(false);
      }
    );

    return () => {
      console.log("SessionContextProvider: Cleaning up auth state change subscription.");
      subscription.unsubscribe();
    };
  }, [fetchProfileWithTimeout]); // Depend on fetchProfileWithTimeout

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