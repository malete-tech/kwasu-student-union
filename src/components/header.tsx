"use client";

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Home, Users, Newspaper, CalendarDays, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About SU", href: "/about", icon: Users },
  { name: "Executives", href: "/executives", icon: Users },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Services", href: "/services", icon: Briefcase },
];

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center text-lg font-bold text-brand-700 hover:text-brand-600 focus-visible:ring-brand-500 rounded-md outline-none">
          <img src="/imageu-removebg-preview.png" alt="KWASU SU Logo" className="h-10 w-10" />
          <span className="sr-only sm:not-sr-only ml-2">KWASU SU</span>
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
                    <img src="/imageu-removebg-preview.png" alt="KWASU SU Logo" className="h-8 w-8 mr-2" />
                    KWASU SU Menu
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
                      <link.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-brand-500")} />
                      <span className="text-lg font-medium">{link.name}</span>
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
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand-500 focus-visible:ring-brand-500 rounded-md outline-none ${
                    isActive ? "text-brand-700" : "text-muted-foreground"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;