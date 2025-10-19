"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AdminNavigation from "@/components/admin/AdminNavigation"; // Updated import

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | KWASU Students' Union</title>
        <meta name="description" content="Administrator dashboard for managing KWASU Students' Union website content." />
      </Helmet>
      <div className="flex min-h-screen bg-gray-100">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="flex flex-col h-screen w-64 bg-brand-800 text-white p-4 shadow-xl">
            <AdminNavigation />
          </aside>
        )}

        <div className="flex-1 flex flex-col">
          <header className="w-full bg-white shadow-sm h-16 flex items-center px-6 justify-between lg:justify-start">
            <h1 className="text-2xl font-semibold text-brand-700">Admin Dashboard</h1>
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto focus-visible:ring-brand-gold">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle admin navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-brand-800 text-white p-4">
                  <AdminNavigation onLinkClick={closeSheet} />
                </SheetContent>
              </Sheet>
            )}
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;