"use client";

import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Menu, 
  ChevronRight,
  Bell,
  Briefcase,
  Star,
  Settings,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLayout: React.FC = () => {
  const { session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "News", href: "/admin/news", icon: Newspaper },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Executives", href: "/admin/executives", icon: Users },
    { name: "Documents", href: "/admin/documents", icon: FileText },
    { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
    { name: "Student Spotlight", href: "/admin/spotlight", icon: Star },
    { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
    { name: "Partners", href: "/admin/partners", icon: Handshake },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/admin/login");
    }
  };

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
    return (
      <Link
        to={item.href}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive 
            ? "bg-brand-700 text-brand-gold shadow-lg shadow-black/20 translate-x-1" 
            : "text-brand-100 hover:bg-brand-800 hover:text-white"
        }`}
      >
        <item.icon className={`w-4 h-4 ${isActive ? "text-brand-gold" : "text-brand-300 group-hover:text-brand-100"}`} />
        <span className="text-sm font-medium">{item.name}</span>
        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-900 hidden lg:flex flex-col z-30 shadow-2xl border-r border-brand-800/50">
        {/* Header - Fixed Height */}
        <div className="h-20 flex items-center px-6 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-brand-gold rounded-lg flex items-center justify-center text-brand-900 shadow-lg shadow-brand-gold/20 group-hover:scale-105 transition-transform">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Admin</h1>
              <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest mt-1">KWASU SU</p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer (User Identity & Logout) - Collapsed for height safety */}
        <div className="mt-auto p-4 border-t border-brand-800/50 bg-brand-950/30 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-900 font-bold text-xs">
              {session?.user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{session?.user?.email?.split('@')[0]}</p>
              <p className="text-[9px] text-brand-400 uppercase font-medium">Administrator</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 h-10 px-3 text-red-300 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-900 text-white border-b border-brand-800 px-4 flex items-center justify-between z-40 shadow-md">
        <div className="flex items-center gap-3">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-none bg-brand-900">
              <div className="flex flex-col h-full">
                <div className="h-16 flex items-center px-6 border-b border-brand-800">
                  <span className="text-lg font-bold text-white">Admin Menu</span>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </nav>
                <div className="p-4 border-t border-brand-800 bg-brand-950/30">
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-11 px-4 text-red-400 hover:bg-red-950/40 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold">Sign Out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold tracking-tight">KWASU Admin</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-900 text-xs font-bold shadow-inner">
          {session?.user?.email?.[0]?.toUpperCase() || "A"}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-black text-brand-900 uppercase tracking-tight">
              {navigation.find(item => location.pathname.startsWith(item.href))?.name || "Dashboard"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Active Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
                <Bell size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
                <Settings size={18} />
              </Button>
            </div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-none">{session?.user?.email?.split('@')[0]}</p>
                <Link to="/admin/update-password" title="Settings" className="text-[10px] text-brand-600 hover:underline">Manage Account</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 pt-20 lg:pt-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;