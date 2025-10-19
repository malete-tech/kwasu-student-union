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

const SessionContext = createContext<SessionContextType | undefined>(undefined);

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
        console.log(`SessionContextProvider: Auth state change event: ${event}, newSession:`, newSession);
        setLoading(true); // Always set loading to true at the start of an auth state change

        try {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            console.log("SessionContextProvider: Attempting to fetch profile for user:", newSession.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
              console.error("SessionContextProvider: Error fetching profile:", profileError);
              setProfile(null);
              setIsAdmin(false);
            } else if (profileData) {
              console.log("SessionContextProvider: Profile data fetched:", profileData);
              setProfile(profileData as Profile);
              setIsAdmin(profileData.is_admin || false);
            } else {
              console.log("SessionContextProvider: No profile found for user. Setting isAdmin to false.");
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
          // Ensure state is reset even on unexpected errors
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } finally {
          console.log("SessionContextProvider: Auth state change processing finished. Setting loading to false.");
          setLoading(false);
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