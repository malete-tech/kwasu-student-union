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
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } else {
          setSession(session);
          setUser(session?.user || null);
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error("Error fetching profile:", profileError);
              setProfile(null);
              setIsAdmin(false);
            } else if (profileData) {
              setProfile(profileData as Profile);
              setIsAdmin(profileData.is_admin || false);
              console.log("Initial session check - Profile Data:", profileData);
              console.log("Initial session check - Is Admin:", profileData.is_admin || false);
            } else {
              console.log("Initial session check - No profile found for user:", session.user.id);
              setProfile(null);
              setIsAdmin(false);
            }
          } else {
            console.log("Initial session check - No user in session.");
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile on auth state change:", profileError);
            setProfile(null);
            setIsAdmin(false);
          } else if (profileData) {
            setProfile(profileData as Profile);
            setIsAdmin(profileData.is_admin || false);
            console.log("Auth state change - Profile Data:", profileData);
            console.log("Auth state change - Is Admin:", profileData.is_admin || false);
          } else {
            console.log("Auth state change - No profile found for user:", newSession.user.id);
            setProfile(null);
            setIsAdmin(false);
          }
        } else {
          console.log("Auth state change - No user in session.");
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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