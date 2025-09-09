"use client";

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About SU", href: "/about" },
  { name: "Executives", href: "/executives" },
  { name: "News & Announcements", href: "/news" },
  { name: "Events & Calendar", href: "/events" },
  { name: "Services", href: "/services" },
  { name: "Contact Us", href: "/contact" },
];

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700 dark:text-brand-50 hover:text-brand-600 dark:hover:text-brand-100 focus-visible:ring-brand-500 rounded-md outline-none">
          <img src="/kwasu-su-logo.png" alt="KWASU SU Logo" className="h-8 w-8" />
          KWASU SU
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="focus-visible:ring-brand-500">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 pt-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      className={({ isActive }) =>
                        `text-lg font-medium transition-colors hover:text-brand-500 dark:hover:text-brand-300 focus-visible:ring-brand-500 rounded-md outline-none ${
                          isActive ? "text-brand-600 dark:text-brand-200" : "text-muted-foreground"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand-500 dark:hover:text-brand-300 focus-visible:ring-brand-500 rounded-md outline-none ${
                    isActive ? "text-brand-600 dark:text-brand-200" : "text-muted-foreground"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;