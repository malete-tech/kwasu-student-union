"use client";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Users,
  MessageSquare,
  Download,
  Briefcase,
  Star,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const adminNavLinks: AdminLink[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Executives", href: "/admin/executives", icon: Users },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
  { name: "Documents", href: "/admin/documents", icon: Download },
  { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
  { name: "Spotlight", href: "/admin/spotlight", icon: Star },
];

const AdminSidebar: React.FC = () => {
  // Placeholder for logout logic
  const handleLogout = () => {
    console.log("Admin logout initiated...");
    // In a real app, this would clear authentication state and redirect to login
    // For now, we'll just redirect to the admin login page
    window.location.href = "/admin/login";
  };

  return (
    <aside className="flex flex-col h-screen w-64 bg-brand-800 text-white p-4 shadow-xl">
      <div className="flex items-center justify-center h-16 mb-6">
        <Link to="/admin" className="flex items-center text-2xl font-bold text-brand-gold hover:text-brand-gold/90 focus-visible:ring-brand-gold rounded-md outline-none">
          <img src="/imageu-removebg-preview.png" alt="KWASU SU Logo" className="h-8 w-8 mr-2" />
          Admin Panel
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            end={link.href === "/admin"} // 'end' prop for exact match on dashboard
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-brand-700 hover:text-brand-gold focus-visible:ring-brand-gold outline-none",
                isActive ? "bg-brand-700 text-brand-gold" : "text-brand-100"
              )
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-brand-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-brand-100 hover:bg-brand-700 hover:text-destructive focus-visible:ring-destructive"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;