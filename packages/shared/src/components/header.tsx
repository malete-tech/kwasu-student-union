"use client";

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HamburgerButton } from "@/components/ui/hamburger-button";

const navLinks = [
  { name: "Home", href: "/", icon: "fa-solid fa-house" },
  { name: "About SU", href: "/about", icon: "fa-solid fa-users" },
  { name: "News", href: "/news", icon: "fa-solid fa-newspaper" },
  { name: "Events", href: "/events", icon: "fa-solid fa-calendar-days" },
  { name: "Services", href: "/services", icon: "fa-solid fa-briefcase" },
];

const executiveLinks = [
  { name: "Central Executive", href: "/executives/central" },
  { name: "Senate Council", href: "/executives/senate" },
  { name: "Judiciary Council", href: "/executives/judiciary" },
  { name: "Past Executives", href: "/executives/past" },
];

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none px-3 py-2",
      isActive ? "text-brand-700 font-extrabold" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center focus-visible:ring-brand-500 rounded-md outline-none">
          <img src="/logo.png" alt="KWASU SU Logo" className="h-12 w-12 object-contain" />
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <HamburgerButton isOpen={isSheetOpen} variant="default" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] flex flex-col">
                <SheetHeader className="pb-4">
                  <SheetTitle className="flex items-center text-brand-700 uppercase tracking-wider font-bold">
                    <img src="/logo.png" alt="KWASU SU Logo" className="h-10 w-10 mr-2 object-contain" />
                    MENU
                  </SheetTitle>
                  <Separator />
                </SheetHeader>
                
                <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 p-3 rounded-lg transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none uppercase tracking-wider text-sm font-bold",
                          isActive
                            ? "bg-brand-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <i className={cn(link.icon, "w-6 text-center text-lg", isActive ? "text-white" : "text-brand-500")}></i>
                          <span>{link.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                  <Separator className="my-2" />
                  <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider px-3">EXECUTIVE COUNCILS</h4>
                  {executiveLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 p-3 pl-6 rounded-lg transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none uppercase tracking-wider text-xs font-bold",
                          isActive
                            ? "bg-brand-100 text-brand-700 shadow-sm"
                            : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                        )
                      }
                    >
                      <i className="fa-solid fa-users-viewfinder w-6 text-center text-brand-500"></i>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </nav>

                <SheetFooter className="mt-6 pt-4 border-t">
                  <Button asChild className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold font-bold uppercase tracking-wider text-xs">
                    <Link to="/contact" onClick={closeSheet}>
                      <i className="fa-solid fa-envelope mr-2"></i> CONTACT US
                    </Link>
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.href} className={linkClasses}>
                {link.name}
              </NavLink>
            ))}
            
            {/* Executives Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none px-3 py-2">
                  EXECUTIVES <i className="fa-solid fa-chevron-down text-[10px] opacity-50 ml-1"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-2 rounded-xl">
                {executiveLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild className="rounded-lg cursor-pointer text-xs font-bold uppercase tracking-wider">
                    <Link to={link.href} className="w-full">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-4">
              <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold font-bold uppercase tracking-wider text-xs px-4">
                <Link to="/contact">CONTACT US</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;