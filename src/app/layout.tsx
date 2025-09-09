"use client";

import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="flex items-center space-x-2">
              <img src="/imageu-removebg-preview.png" alt="KWASU SU Logo" className="h-8 w-8" />
              <span className="inline-block font-bold">KWASU SU</span>
            </a>
            {/* Navigation links will go here */}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              {/* Theme toggle removed */}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} KWASU Students' Union. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;