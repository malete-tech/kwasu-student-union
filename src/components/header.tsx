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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About SU", href: "/about", icon: Users },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Services", href: "/services", icon: Briefcase },
];

const executiveLinks = [
  { name: "Central Executive", href: "/executives/central", description: "The main administrative body." },
  { name: "Senate Council", href: "/executives/senate", description: "The legislative arm." },
  { name: "Judiciary Council", href: "/executives/judiciary", description: "The judicial arm." },
];

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";


const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  // Custom style for standalone navigation links
  const customNavLinkStyle = (isActive: boolean) =>
    cn(
      navigationMenuTriggerStyle(),
      "text-sm font-medium transition-colors hover:text-brand-500 focus-visible:ring-brand-500 rounded-md outline-none",
      // Override default shadcn background/hover styles to make it standalone
      "bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent",
      isActive ? "text-brand-700" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center focus-visible:ring-brand-500 rounded-md outline-none">
          <img src="/kwasu-su-logo-new.png" alt="KWASU SU Logo" className="h-12 w-12" />
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
                    <img src="/kwasu-su-logo-new.png" alt="KWASU SU Logo" className="h-10 w-10 mr-2" />
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
                  {/* Mobile Executive Links */}
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
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) => customNavLinkStyle(isActive)}
                  >
                    {link.name}
                  </NavLink>
                </NavigationMenuItem>
              ))}
              
              {/* Executive Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  navigationMenuTriggerStyle(),
                  "text-muted-foreground data-[active]:text-brand-700 data-[state=open]:text-brand-700",
                  // Override default shadcn background/hover styles
                  "bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent"
                )}>
                  Executives
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {executiveLinks.map((link) => (
                      <ListItem
                        key={link.name}
                        title={link.name}
                        href={link.href}
                      >
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
    </header>
  );
};

export default Header;