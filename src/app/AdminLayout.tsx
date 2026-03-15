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
            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 translate-x-1" 
            : "text-slate-600 hover:bg-brand-50 hover:text-brand-600"
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500"}`} />
        <span className="font-medium">{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-30 shadow-sm">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Admin</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Management Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border-2 border-white shadow-sm">
                {session?.user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.email?.split('@')[0] || "Admin"}</p>
                <p className="text-xs text-slate-500 truncate">Administrator</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-0">
              <div className="flex flex-col h-full bg-white">
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white">
                      <LayoutDashboard size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Admin</h1>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                  {navigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold text-slate-900">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
            {session?.user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="hidden lg:flex items-center justify-between px-10 py-6 bg-white/50 backdrop-blur-sm border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {navigation.find(item => location.pathname.startsWith(item.href))?.name || "Dashboard"}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">Welcome back, manager!</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 w-64 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-xl">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-xl">
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