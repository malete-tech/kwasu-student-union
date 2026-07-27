"use client";

import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Briefcase,
  Star,
  Handshake,
  Megaphone,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { UserDropdown } from "@/components/admin/UserDropdown";

// ─── Bottom nav (mobile) ────────────────────────────────────────────────────
const BOTTOM_NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "News",      href: "/news",       icon: Newspaper },
  { name: "Events",   href: "/events",     icon: Calendar },
  { name: "Complaints", href: "/complaints", icon: MessageSquare },
];

// ─── Sidebar section groups ─────────────────────────────────────────────────
const NAV_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Content",
    items: ["News", "Events", "Documents", "Opportunities", "Spotlight", "Announcements"],
  },
  { label: "People",  items: ["Executives", "Complaints"] },
  { label: "System",  items: ["Partners"] },
];

// Icon map used in sidebar (avoids relying on nav config icons for each item)
const ICON_MAP: Record<string, React.ElementType> = {
  Dashboard:     LayoutDashboard,
  News:          Newspaper,
  Events:        Calendar,
  Executives:    Users,
  Documents:     FileText,
  Opportunities: Briefcase,
  Spotlight:     Star,
  Complaints:    MessageSquare,
  Partners:      Handshake,
  Announcements: Megaphone,
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function getCurrentPageName(pathname: string): string {
  for (const item of NAVIGATION_ITEMS) {
    if (item.children) {
      for (const child of item.children) {
        if (pathname === child.href) return child.name;
      }
    }
    if (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href)) {
      if (pathname.includes("/add"))  return `Add ${item.name.replace(/s$/, "")}`;
      if (pathname.includes("/edit")) return `Edit ${item.name.replace(/s$/, "")}`;
      return item.name;
    }
  }
  return "Dashboard";
}

function getBreadcrumbs(pathname: string): { name: string; href: string }[] {
  const crumbs: { name: string; href: string }[] = [{ name: "Dashboard", href: "/" }];
  if (pathname === "/") return crumbs;
  for (const item of NAVIGATION_ITEMS) {
    if (item.href !== "/" && pathname.startsWith(item.href)) {
      crumbs.push({ name: item.name, href: item.href });
      if (pathname.includes("/add"))  crumbs.push({ name: `Add ${item.name.replace(/s$/, "")}`,  href: pathname });
      else if (pathname.includes("/edit")) crumbs.push({ name: `Edit ${item.name.replace(/s$/, "")}`, href: pathname });
      break;
    }
  }
  return crumbs;
}

// ─── Single Nav Link ─────────────────────────────────────────────────────────
function NavLink({
  name,
  href,
  pathname,
  onClose,
}: {
  name: string;
  href: string;
  pathname: string;
  onClose: () => void;
}) {
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const Icon = ICON_MAP[name];

  return (
    <Link
      to={href}
      onClick={onClose}
      className={cn(
        "group relative flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 select-none",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/55 hover:text-white/90 hover:bg-white/5"
      )}
    >
      {/* Active accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-gold rounded-r-full" />
      )}

      {Icon && (
        <Icon
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            isActive ? "text-brand-gold" : "text-white/35 group-hover:text-white/70"
          )}
        />
      )}
      <span className="truncate">{name}</span>

      {isActive && (
        <ChevronRight className="w-3 h-3 ml-auto text-white/25 shrink-0" />
      )}
    </Link>
  );
}

// ─── Sidebar content (shared between desktop + mobile sheet) ────────────────
function SidebarContent({
  pathname,
  onClose,
  onLogout,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  const dashboardItem = NAVIGATION_ITEMS.find((i) => i.name === "Dashboard");
  const allGroupedNames = NAV_GROUPS.flatMap((g) => g.items);

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="h-14 flex items-center px-5 shrink-0">
        <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <img src="/logo.png" alt="KWASU SU" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-tight tracking-wide">KWASU SU</p>
            <p className="text-[10px] text-white/35 font-medium tracking-wider uppercase mt-px">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-white/8 shrink-0" />

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-none">
        {/* Dashboard — standalone */}
        {dashboardItem && (
          <NavLink
            name={dashboardItem.name}
            href={dashboardItem.href}
            pathname={pathname}
            onClose={onClose}
          />
        )}

        {/* Grouped sections */}
        {NAV_GROUPS.map((group) => {
          const groupItems = NAVIGATION_ITEMS.filter((i) =>
            group.items.includes(i.name)
          );
          if (groupItems.length === 0) return null;
          return (
            <div key={group.label}>
              {/* Section label */}
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-[0.1em]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {groupItems.map((item) => (
                  <NavLink
                    key={item.name}
                    name={item.name}
                    href={item.href}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Ungrouped items */}
        {NAVIGATION_ITEMS.filter(
          (i) => i.name !== "Dashboard" && !allGroupedNames.includes(i.name)
        ).map((item) => (
          <NavLink
            key={item.name}
            name={item.name}
            href={item.href}
            pathname={pathname}
            onClose={onClose}
          />
        ))}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-white/8 shrink-0" />

      {/* ── Footer / Sign Out ── */}
      <div className="p-3 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-medium text-red-400/80 hover:text-red-300 hover:bg-red-950/30 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────
const AdminLayout: React.FC = () => {
  const { session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentPageName = getCurrentPageName(location.pathname);
  const breadcrumbs     = getBreadcrumbs(location.pathname);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/login");
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ══ Desktop Sidebar ══════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col z-30"
        style={{ background: "hsl(150 60% 8%)" }}>
        <SidebarContent
          pathname={location.pathname}
          onClose={closeSidebar}
          onLogout={handleLogout}
        />
      </aside>

      {/* ══ Mobile Top Header ════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-none"
              style={{ background: "hsl(150 60% 8%)" }}>
              <SidebarContent
                pathname={location.pathname}
                onClose={closeSidebar}
                onLogout={handleLogout}
              />
            </SheetContent>
          </Sheet>

          <span className="text-sm font-semibold text-slate-800">{currentPageName}</span>
        </div>

        <UserDropdown
          userEmail={session?.user?.email}
          onLogout={handleLogout}
          className="hover:bg-slate-50"
        />
      </header>

      {/* ══ Main Content ═════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">

        {/* Desktop top bar */}
        <header className="hidden lg:flex h-14 items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    to={crumb.href}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-semibold">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
            >
              <Bell size={16} />
            </Button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <UserDropdown
              userEmail={session?.user?.email}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-6 pb-24 lg:pb-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ══ Mobile Bottom Nav ════════════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-stretch z-40">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-brand-600")} />
              <span>{item.name}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-gold rounded-b" />
              )}
            </Link>
          );
        })}

        {/* More — opens full sidebar sheet */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
              <span>More</span>
            </button>
          </SheetTrigger>
        </Sheet>
      </nav>
    </div>
  );
};

export default AdminLayout;
