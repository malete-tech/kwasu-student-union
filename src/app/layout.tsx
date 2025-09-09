"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;