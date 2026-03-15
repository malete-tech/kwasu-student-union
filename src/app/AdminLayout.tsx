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
  Search,
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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? "bg-brand-700 text-brand-gold shadow-lg shadow-black/20 translate-x-1" 
            : "text-brand-100 hover:bg-brand-800 hover:text-white"
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? "text-brand-gold" : "text-brand-300 group-hover:text-brand-100"}`} />
        <span className="font-medium">{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-brand-900 hidden lg:flex flex-col z-30 shadow-2xl overflow-hidden border-r border-brand-800/50">
        {/* Header - Fixed */}
        <div className="p-8 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-900 shadow-lg shadow-brand-gold/20 group-hover:scale-105 transition-transform">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">Admin</h1>
              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mt-1">KWASU SU Portal</p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer (User Profile & Logout) - Fixed at bottom */}
        <div className="p-4 flex-shrink-0 border-t border-brand-800 bg-brand-950/50">
          <div className="p-4 bg-brand-800/50 rounded-2xl mb-3 border border-brand-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-900 font-bold border-2 border-brand-600 shadow-sm">
                {session?.user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{session?.user?.email?.split('@')[0] || "Admin"}</p>
                <p className="text-[10px] text-brand-400 uppercase font-bold tracking-tighter">Administrator</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 px-4 py-3 text-brand-300 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden sticky top-0 bg-brand-900 text-white border-b border-brand-800 px-4 py-3 flex items-center justify-between z-40 shadow-md">
        <div className="flex items-center gap-3">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-100 hover:bg-brand-800">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-none bg-brand-900">
              <div className="flex flex-col h-full overflow-hidden">
                <div className="p-8 border-b border-brand-800 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-900">
                      <LayoutDashboard size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-white">Admin</h1>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                  {navigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </nav>
                <div className="p-4 border-t border-brand-800 flex-shrink-0 bg-brand-950/50">
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold text-white tracking-tight">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-900 text-xs font-bold border border-brand-600">
            {session?.user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="hidden lg:flex items-center justify-between px-10 py-6 bg-white border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900 uppercase tracking-tight">
              {navigation.find(item => location.pathname.startsWith(item.href))?.name || "Dashboard"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Manage your campus digital hub.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 w-64 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-10 py-6 md:py-10 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;