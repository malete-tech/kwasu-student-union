"use client";

import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useSession } from "@/components/SessionContextProvider"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase for logout

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useSession(); // Use the session context

  const closeSheet = () => setIsSheetOpen(false);

  useEffect(() => {
    console.log("AdminLayout: useEffect triggered. Loading:", loading, "Session:", !!session, "IsAdmin:", isAdmin);
    if (!loading) {
      if (!session) {
        // If not loading and no session, redirect to login
        console.log("AdminLayout: No session found, redirecting to /admin/login.");
        navigate("/admin/login", { replace: true });
      } else if (!isAdmin) {
        // If logged in but not admin, redirect to home or a non-admin page
        console.warn("AdminLayout: Authenticated user is not an admin. Redirecting to home.");
        navigate("/", { replace: true });
      }
    }
  }, [session, isAdmin, loading, navigate]);

  // Placeholder for logout logic
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      // Optionally show a toast error
    } else {
      console.log("Admin logout successful.");
      navigate("/admin/login", { replace: true });
    }
    closeSheet(); // Close sheet on logout
  };

  if (loading) {
    // Show a loading spinner or a simple message while checking auth state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-brand-700">Checking administrator access...</p>
      </div>
    );
  }

  // Only render the layout if session exists and user is an admin
  if (session && isAdmin) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | KWASU Students' Union</title>
          <meta name="description" content="Administrator dashboard for managing KWASU Students' Union website content." />
        </Helmet>
        <div className="flex min-h-screen bg-gray-100">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="flex flex-col h-screen w-64 bg-brand-800 text-white p-4 shadow-xl">
              <AdminNavigation onLogout={handleLogout} /> {/* Pass handleLogout */}
            </aside>
          )}

          <div className="flex-1 flex flex-col">
            <header className="w-full bg-white shadow-sm h-16 flex items-center px-6 justify-between lg:justify-start">
              <h1 className="text-2xl font-semibold text-brand-700">Admin Dashboard</h1>
              {/* Mobile Menu Button */}
              {isMobile && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto focus-visible:ring-brand-gold">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle admin navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-brand-800 text-white p-4">
                    <AdminNavigation onLinkClick={closeSheet} onLogout={handleLogout} /> {/* Pass handleLogout */}
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

  return null; // Should not be reached if redirects work correctly
};

export default AdminLayout;