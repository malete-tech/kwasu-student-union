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
    console.log("SessionContextProvider: Initializing useEffect.");
    const getSession = async () => {
      console.log("SessionContextProvider: getSession() started. Setting loading to true.");
      setLoading(true);
      try {
        console.log("SessionContextProvider: Calling supabase.auth.getSession().");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log("SessionContextProvider: supabase.auth.getSession() returned.");

        if (error) {
          console.error("SessionContextProvider: Error getting initial session:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } else {
          console.log("SessionContextProvider: Initial session data received:", initialSession);
          setSession(initialSession);
          setUser(initialSession?.user || null);
          if (initialSession?.user) {
            console.log("SessionContextProvider: Fetching profile for initial session user:", initialSession.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', initialSession.user.id)
              .single();
            console.log("SessionContextProvider: Profile fetch for initial session returned.");

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error("SessionContextProvider: Error fetching profile for initial session:", profileError);
              setProfile(null);
              setIsAdmin(false);
            } else if (profileData) {
              console.log("SessionContextProvider: Initial profile data:", profileData);
              setProfile(profileData as Profile);
              setIsAdmin(profileData.is_admin || false);
            } else {
              console.log("SessionContextProvider: No profile found for initial session user.");
              setProfile(null);
              setIsAdmin(false);
            }
          } else {
            console.log("SessionContextProvider: No user in initial session.");
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } catch (e) {
        console.error("SessionContextProvider: Unexpected error in getSession:", e);
      } finally {
        console.log("SessionContextProvider: getSession() finished. Setting loading to false.");
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`SessionContextProvider: Auth state change event: ${event}, newSession:`, newSession);
        setLoading(true); // Set loading to true during auth state change processing
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          console.log("SessionContextProvider: Fetching profile on auth state change for user:", newSession.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          console.log("SessionContextProvider: Profile fetch on auth state change returned.");

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("SessionContextProvider: Error fetching profile on auth state change:", profileError);
            setProfile(null);
            setIsAdmin(false);
          } else if (profileData) {
            console.log("SessionContextProvider: Profile data on auth state change:", profileData);
            setProfile(profileData as Profile);
            setIsAdmin(profileData.is_admin || false);
          } else {
            console.log("SessionContextProvider: No profile found for user on auth state change.");
            setProfile(null);
            setIsAdmin(false);
          }
        } else {
          console.log("SessionContextProvider: No user in new session on auth state change.");
          setProfile(null);
          setIsAdmin(false);
        }
        console.log("SessionContextProvider: Auth state change processing finished. Setting loading to false.");
        setLoading(false);
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