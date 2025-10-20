"use client";

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { session, profile, loading } = useSession();

  const closeSheet = () => setIsSheetOpen(false);

  useEffect(() => {
    console.log("AdminLayout auth:", { loading, hasSession: !!session, profile });

    if (loading) return; // still checking initial state

    if (!session) {
      console.log("No session → redirecting to /admin/login");
      navigate("/admin/login", { replace: true });
      return;
    }

    // redirect only after profile fetch completes (profile !== undefined)
    if (profile === null) {
      console.warn("Session present but no profile → redirecting to /");
      navigate("/", { replace: true });
    }
  }, [session, profile, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    else console.log("Admin logout successful");
    navigate("/admin/login", { replace: true });
    closeSheet();
  };

  // show loader until profile fetch completes
  if (loading || profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-brand-700">Checking administrator access...</p>
      </div>
    );
  }

  // render only when both session & profile confirmed
  if (session && profile) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | KWASU Students' Union</title>
          <meta name="description" content="Administrator dashboard for managing KWASU Students' Union website content." />
        </Helmet>

        <div className="flex min-h-screen bg-gray-100">
          {!isMobile && (
            <aside className="fixed top-0 left-0 flex flex-col h-screen w-64 bg-brand-800 text-white p-4 shadow-xl z-40">
              <AdminNavigation onLogout={handleLogout} />
            </aside>
          )}

          <div className="flex-1 flex flex-col lg:ml-64">
            <header className="w-full bg-white shadow-sm h-16 flex items-center px-6 justify-between lg:justify-start">
              <h1 className="text-2xl font-semibold text-brand-700">Admin Dashboard</h1>
              {isMobile && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto focus-visible:ring-brand-gold">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle admin navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-brand-800 text-white p-4">
                    <AdminNavigation onLinkClick={closeSheet} onLogout={handleLogout} />
                  </SheetContent>
                </Sheet>
              )}
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default AdminLayout;