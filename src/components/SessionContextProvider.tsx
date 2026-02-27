"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, []);

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!isMounted) return;
      
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }
      
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await fetchProfile(newUser.id);
      } else {
        setProfile(null);
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return (
    <SessionContext.Provider value={{ session, user, profile, loading, refreshProfile }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);