"use client";

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Settings, ChevronRight } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useSession();

  const closeSheet = () => setIsSheetOpen(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate("/admin/login", { replace: true });
    }
  }, [session, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    navigate("/admin/login", { replace: true });
    closeSheet();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/news")) return "News Management";
    if (path.includes("/events")) return "Events Calendar";
    if (path.includes("/executives")) return "Executive Council";
    if (path.includes("/documents")) return "Document Vault";
    if (path.includes("/complaints")) return "Student Grievances";
    if (path.includes("/opportunities")) return "Opportunities";
    return "Dashboard Overview";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-brand-700 font-medium animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | KWASU Students' Union</title>
          <meta name="description" content="Administrator dashboard for managing KWASU Students' Union website content." />
        </Helmet>

        <div className="flex min-h-screen bg-[#F8FAFC]">
          {!isMobile && (
            <aside className="fixed top-0 left-0 flex flex-col h-screen w-64 bg-brand-800 text-white p-6 shadow-2xl z-50 border-r border-brand-700/50">
              <AdminNavigation onLogout={handleLogout} />
            </aside>
          )}

          <div className={`flex-1 flex flex-col ${!isMobile ? 'lg:ml-64' : ''}`}>
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center px-6 md:px-10 justify-between">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-brand-50 text-brand-700">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] bg-brand-800 text-white p-6 border-none">
                      <AdminNavigation onLinkClick={closeSheet} onLogout={handleLogout} />
                    </SheetContent>
                  </Sheet>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center text-xs font-semibold text-brand-400 uppercase tracking-widest mb-0.5">
                    Admin <ChevronRight className="h-3 w-3 mx-1" /> {getPageTitle() === "Dashboard Overview" ? "Main" : "Module"}
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-brand-100 hover:border-brand-200 transition-all">
                      <Avatar className="h-9 w-9 ring-2 ring-white ring-offset-2 ring-offset-brand-50">
                        <AvatarImage src={session.user.user_metadata?.['avatar_url']} />
                        <AvatarFallback className="bg-brand-600 text-white font-bold">
                          {session.user.email?.charAt(0).toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl border-gray-100 shadow-xl" align="end">
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {session.user.user_metadata?.['first_name'] || "Administrator"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem className="p-3 rounded-xl focus:bg-brand-50 focus:text-brand-700 cursor-pointer transition-colors">
                      <User className="mr-3 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 rounded-xl focus:bg-brand-50 focus:text-brand-700 cursor-pointer transition-colors">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="p-3 rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer transition-colors font-medium"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <main className="flex-1 px-6 md:px-10 py-10 max-w-[1400px] mx-auto w-full">
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