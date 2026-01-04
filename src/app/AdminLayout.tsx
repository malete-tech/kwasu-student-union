"use client";

import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const navigate = useNavigate();
  const { session, profile, loading } = useSession();

  const closeSheet = () => setIsSheetOpen(false);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (profile && profile.role !== 'admin') {
      toast.error("Access Denied: You do not have administrator privileges.");
      navigate("/", { replace: true });
    }
  }, [session, profile, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
    closeSheet();
  };

  if (loading || (session && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-brand-700">Verifying access...</p>
      </div>
    );
  }

  if (session && profile?.role === 'admin') {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | KWASU Students' Union</title>
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
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] bg-brand-800 text-white p-4">
                    <AdminNavigation onLinkClick={closeSheet} onLogout={handleLogout} />
                  </SheetContent>
                </Sheet>
              )}
            </header>

            <main className="flex-1 px-4 py-6 overflow-y-auto">
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