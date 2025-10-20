"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';


interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean | undefined; // Changed to allow undefined
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined); // Initialize as undefined
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("SessionContextProvider: Initializing auth state listener.");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`SessionContextProvider: Auth state change event: ${event}. Setting loading to true.`);
        setLoading(true);

        try {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            const userId = newSession.user.id;
            console.log("SessionContextProvider: Attempting to fetch profile for user ID:", userId);

            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (profileError) {
              if (profileError.code === 'PGRST116') { // No rows found
                console.warn("SessionContextProvider: No profile found for user ID:", userId);
              } else {
                console.error("SessionContextProvider: Supabase error fetching profile:", profileError);
              }
              setProfile(null);
              setIsAdmin(false); // Explicitly set to false if no profile or error
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
            setIsAdmin(false); // Explicitly set to false if no user
          }
        } catch (e) {
          console.error("SessionContextProvider: Unexpected error during auth state change processing:", e);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } finally {
          console.log(`SessionContextProvider: Auth state change processing finished for event ${event}. Setting loading to false.`);
          console.log(`SessionContextProvider: Final state - session: ${!!newSession}, user: ${!!newSession?.user}, isAdmin: ${isAdmin}, profile: ${!!profile}`);
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
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};