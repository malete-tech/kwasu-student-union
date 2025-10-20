"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

  // Use refs to store the current user ID and profile to avoid re-fetching if it's the same user
  const currentUserIdRef = useRef<string | null>(null);
  const currentProfileRef = useRef<Profile | null>(null);

  const PROFILE_FETCH_TIMEOUT = 30000; // Increased timeout to 30 seconds

  const fetchProfileWithTimeout = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Profile fetch timed out after ${PROFILE_FETCH_TIMEOUT / 1000} seconds.`)), PROFILE_FETCH_TIMEOUT)
        )
      ]);

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("SessionContextProvider: Supabase error fetching profile:", error);
        return null;
      }
      return data as Profile | null;
    } catch (e: any) {
      console.error("SessionContextProvider: Error or timeout during profile fetch:", e);
      return null;
    }
  }, []); // No dependencies, this function is stable

  const handleAuthEvent = useCallback(async (event: string, newSession: Session | null) => {
    console.log(`SessionContextProvider: Processing auth event: ${event}. New session: ${newSession ? "present" : "null"}. Current user ID ref: ${currentUserIdRef.current}`);
    
    // Optimization: If the user ID hasn't changed and we already have a profile, and it's not a user update, skip.
    // This prevents unnecessary re-renders on tab refocus if the session is effectively the same.
    if (
      (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
      newSession?.user?.id === currentUserIdRef.current &&
      currentProfileRef.current // Only skip if profile is already loaded for this user
    ) {
      console.log("SessionContextProvider: Skipping redundant state update for same user and existing profile.");
      setLoading(false); // Ensure loading is false if we skip
      return;
    }

    setLoading(true); // Set loading true for any meaningful auth state change

    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
      currentUserIdRef.current = newSession.user.id; // Update ref

      console.log("SessionContextProvider: User present. Attempting to fetch profile for user ID:", newSession.user.id);
      const fetchedProfile = await fetchProfileWithTimeout(newSession.user.id);
      
      if (fetchedProfile) {
        console.log("SessionContextProvider: Profile data fetched:", fetchedProfile);
        setProfile(fetchedProfile);
        setIsAdmin(fetchedProfile.is_admin || false);
        currentProfileRef.current = fetchedProfile; // Update profile ref
      } else {
        console.warn("SessionContextProvider: Profile not found or fetch failed for user ID:", newSession.user.id);
        setProfile(null);
        setIsAdmin(false);
        currentProfileRef.current = null;
      }
    } else {
      // User signed out or no session
      console.log("SessionContextProvider: No user in session. Clearing state.");
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      currentUserIdRef.current = null; // Clear ref
      currentProfileRef.current = null;
    }
    console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
    setLoading(false);
  }, [fetchProfileWithTimeout]); // handleAuthEvent depends on fetchProfileWithTimeout

  useEffect(() => {
    console.log("SessionContextProvider: Setting up auth state change subscription.");

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        await handleAuthEvent(event, newSession);
      }
    );

    // The 'INITIAL_SESSION' event from onAuthStateChange should handle the initial load.
    // No need for a separate getInitialSession call here.
    // The `loading` state starts as true and will be set to false by handleAuthEvent.

    return () => {
      console.log("SessionContextProvider: Cleaning up auth state change subscription.");
      subscription.unsubscribe();
    };
  }, [handleAuthEvent]); // Only depends on the stable handleAuthEvent callback

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