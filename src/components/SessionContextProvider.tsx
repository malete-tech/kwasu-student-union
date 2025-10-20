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
  const [loading, setLoading] = useState<boolean>(true);

  const currentUserIdRef = useRef<string | null>(null);
  const currentProfileRef = useRef<Profile | null>(null);

  // Simplified profile fetching without an internal timeout
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

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

  const handleAuthEvent = useCallback(async (event: string, newSession: Session | null) => {
    console.log(`SessionContextProvider: Processing auth event: ${event}. New session: ${newSession ? "present" : "null"}. Current user ID ref: ${currentUserIdRef.current}`);
    
    // Always set loading to true at the start of processing a new auth event
    setLoading(true);

    if (newSession) {
      // If the user ID hasn't changed and we already have a profile, and it's not a user update, skip re-fetching profile.
      // This prevents unnecessary re-renders on tab refocus if the session is effectively the same.
      if (
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
        newSession.user.id === currentUserIdRef.current &&
        currentProfileRef.current // Only skip if profile is already loaded for this user
      ) {
        console.log("SessionContextProvider: Skipping redundant profile fetch for same user and existing profile.");
        // Ensure state is consistent even if we skip re-fetching
        setSession(newSession);
        setUser(newSession.user);
        setProfile(currentProfileRef.current);
        setIsAdmin(currentProfileRef.current.is_admin || false);
        setLoading(false); // Important: set loading to false here if we skip
        return;
      }

      setSession(newSession);
      setUser(newSession.user);
      currentUserIdRef.current = newSession.user.id; // Update ref

      console.log("SessionContextProvider: User present. Attempting to fetch profile for user ID:", newSession.user.id);
      const fetchedProfile = await fetchProfile(newSession.user.id); // Use simplified fetchProfile
      
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
  }, [fetchProfile]);

  useEffect(() => {
    console.log("SessionContextProvider: Setting up auth state change subscription.");

    // Fetch initial session and profile immediately on mount
    const getInitialSession = async () => {
      setLoading(true); // Ensure loading is true for initial fetch
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      await handleAuthEvent('INITIAL_SESSION', initialSession);
    };
    getInitialSession();

    // Set up auth state change listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Only process if it's not the initial session, as that's handled by getInitialSession
        if (event !== 'INITIAL_SESSION') {
          await handleAuthEvent(event, newSession);
        }
      }
    );

    return () => {
      console.log("SessionContextProvider: Cleaning up auth state change subscription.");
      subscription.unsubscribe();
    };
  }, [handleAuthEvent]);

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