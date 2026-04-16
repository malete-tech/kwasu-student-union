"use client";

import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Menu, 
  ChevronRight,
  ChevronDown,
  Bell,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NAVIGATION_ITEMS, NavItem, NavChild } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { UserDropdown } from "@/components/admin/UserDropdown";

const AdminLayout: React.FC = () => {
  const { session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  // We'll fetch the profile here if needed, but for now user email is handled by the dropdown

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/login");
    }
  };

  const NavLinkItem = ({ item, isChild = false }: { item: NavItem | NavChild, isChild?: boolean }) => {
    const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
    const hasChildren = 'children' in item && item.children && item.children.length > 0;
    const isMenuOpen = openMenus.includes(item.name);

    if (hasChildren && !isChild) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-left",
              isActive 
                ? "bg-brand-700/50 text-white" 
                : "text-brand-100 hover:bg-brand-800 hover:text-white"
            )}
          >
            {'icon' in item && item.icon && <item.icon className={cn("w-4 h-4", isActive ? "text-brand-gold" : "text-brand-300 group-hover:text-brand-100")} />}
            <span className="text-sm font-medium">{item.name}</span>
            <div className="ml-auto transition-transform duration-200" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none' }}>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </div>
          </button>
          
          {isMenuOpen && (
            <div className="pl-10 space-y-1 mt-1 transition-all">
              {(item as NavItem).children?.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-2 text-sm transition-all relative",
                    location.pathname === child.href 
                      ? "text-brand-gold font-bold" 
                      : "text-brand-300 hover:text-white"
                  )}
                >
                  {location.pathname === child.href && (
                    <span className="absolute -left-4 w-1 h-3 bg-brand-gold rounded-full" />
                  )}
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-brand-700 text-brand-gold shadow-lg shadow-black/20 translate-x-1" 
            : "text-brand-100 hover:bg-brand-800 hover:text-white"
        )}
      >
        {'icon' in item && item.icon && <item.icon className={cn("w-4 h-4", isActive ? "text-brand-gold" : "text-brand-300 group-hover:text-brand-100")} />}
        <span className="text-sm font-medium">{item.name}</span>
        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-900 hidden lg:flex flex-col z-30 shadow-2xl border-r border-brand-800/50">
        <div className="h-20 flex items-center px-6 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-brand-gold rounded-lg flex items-center justify-center text-brand-900 shadow-lg shadow-brand-gold/20 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Admin</h1>
              <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest mt-1">KWASU SU Console</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLinkItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-brand-800/50 bg-brand-950/30 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-900 font-bold text-xs uppercase shadow-inner">
              {session?.user?.email?.[0] || "A"}
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
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md text-slate-900 border-b border-slate-200 px-4 flex items-center justify-between z-40 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-none bg-brand-900 focus:outline-none">
              <div className="flex flex-col h-full">
                <div className="h-16 flex items-center px-6 border-b border-brand-800">
                  <span className="text-lg font-bold text-white">Admin Menu</span>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {NAVIGATION_ITEMS.map((item) => (
                    <NavLinkItem key={item.name} item={item} />
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
          <span className="font-black text-brand-900 uppercase tracking-tighter text-sm">Console</span>
        </div>
        
        <UserDropdown 
          userEmail={session?.user?.email} 
          onLogout={handleLogout}
          className="hover:bg-slate-50"
        />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-20 transition-all duration-300 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-brand-900 uppercase tracking-tight">
              {NAVIGATION_ITEMS.find(item => location.pathname === item.href || location.pathname.startsWith(item.href))?.name || "Dashboard"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Live System Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border-r border-slate-100 pr-5 mr-3">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200">
                <Bell size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200">
                <Settings size={18} />
              </Button>
            </div>
            
            <UserDropdown 
              userEmail={session?.user?.email} 
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 pt-20 lg:pt-8 w-full max-w-[1600px] mx-auto transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
