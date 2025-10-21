"use client";

import React, { createContext, useContext, useEffect, useState } from "react"; // Removed useCallback
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
// Removed Profile import as it's no longer used here

interface SessionContextType {
  session: Session | null;
  user: User | null;
  // Removed profile from context type
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  // Removed profile from default context value
  loading: true,
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // Removed profile state
  const [loading, setLoading] = useState<boolean>(true);

  // Removed fetchProfile useCallback

  useEffect(() => {
    let isMounted = true; // race-safety guard

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false); // stop blocking early

      // Removed profile fetching logic
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Removed profile fetching logic
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Removed fetchProfile from dependencies

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);