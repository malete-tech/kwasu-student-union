"use client";

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Home, Users, Newspaper, CalendarDays, Briefcase, Mail, ChevronDown } from "lucide-react";
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

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About SU", href: "/about", icon: Users },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Services", href: "/services", icon: Briefcase },
];

const executiveLinks = [
  { name: "Central Executive", href: "/executives/central" },
  { name: "Senate Council", href: "/executives/senate" },
  { name: "Judiciary Council", href: "/executives/judiciary" },
];

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none px-3 py-2",
      isActive ? "text-brand-700" : "text-muted-foreground"
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
                <Button variant="ghost" size="icon" className="focus-visible:ring-brand-500">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                <SheetHeader className="pb-4">
                  <SheetTitle className="flex items-center text-brand-700">
                    <img src="/logo.png" alt="KWASU SU Logo" className="h-10 w-10 mr-2 object-contain" />
                    Menu
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
                          "flex items-center gap-4 p-3 rounded-lg transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none",
                          isActive
                            ? "bg-brand-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <link.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-brand-500")} />
                          <span className="text-lg font-medium">{link.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                  <Separator className="my-2" />
                  <h4 className="text-sm font-semibold text-brand-700 px-3">Executive Councils</h4>
                  {executiveLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-4 p-3 pl-6 rounded-lg transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none",
                          isActive
                            ? "bg-brand-100 text-brand-700 shadow-sm"
                            : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                        )
                      }
                    >
                      <Users className="h-5 w-5 text-brand-500" />
                      <span className="text-base font-medium">{link.name}</span>
                    </NavLink>
                  ))}
                </nav>

                <SheetFooter className="mt-6 pt-4 border-t">
                  <Button asChild className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold">
                    <Link to="/contact" onClick={closeSheet}>
                      <Mail className="h-5 w-5 mr-2" /> Contact Us
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
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none px-3 py-2">
                  Executives <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-2 rounded-xl">
                {executiveLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild className="rounded-lg cursor-pointer">
                    <Link to={link.href} className="w-full">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-4">
              <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold font-bold">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;