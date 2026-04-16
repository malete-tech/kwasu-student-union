"use client";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, NavItem } from "@/config/navigation";

interface AdminNavigationProps {
  onLinkClick?: () => void;
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onLinkClick, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-brand-900">
      <div className="flex items-center justify-center h-16 mb-6">
        <Link to="/" className="flex items-center focus-visible:ring-brand-gold rounded-md outline-none" onClick={onLinkClick}>
          <img src="/logo.png" alt="KWASU SU Logo" className="h-12 w-12 object-contain" />
        </Link>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto pb-4 px-4 custom-scrollbar">
        {NAVIGATION_ITEMS.map((link: NavItem) => (
          <NavLink
            key={link.name}
            to={link.href}
            end={link.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-brand-700 hover:text-brand-gold focus-visible:ring-brand-gold outline-none",
                isActive ? "bg-brand-700 text-brand-gold" : "text-brand-100"
              )
            }
            onClick={onLinkClick}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-brand-700 p-4">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-brand-100 hover:bg-brand-700 hover:text-red-400 focus-visible:ring-brand-gold"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminNavigation;