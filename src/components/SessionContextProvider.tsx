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
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
        return null;
      }
      return data as Profile | null;
    } catch (e) {
      console.error("Profile fetch exception:", e);
      return null;
    }
  }, []);

  // Immediate rehydration from local cache and subscription for updates
  useEffect(() => {
    const init = async () => {
      // Attempt to get session from local storage immediately
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false); // Stop blocking UI as soon as local session is known

      if (currentSession?.user) {
        // Fetch profile in parallel, without blocking the initial loading state
        fetchProfile(currentSession.user.id).then(setProfile);
      } else {
        setProfile(null); // Ensure profile is null if no user
      }
    };

    init();

    // Set up subscription for real-time auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Fetch profile for the new session, this will update the profile state
        const profile = await fetchProfile(newSession.user.id);
        setProfile(profile);
      } else {
        setProfile(null); // Clear profile if no user
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <SessionContext.Provider value={{ session, user, profile, loading }}>
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