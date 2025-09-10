"use client";

import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;