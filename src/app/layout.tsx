"use client";

import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Layout = () => {
  const location = useLocation();
  
  // Hide the footer if the path starts with /news (covers /news and /news/:slug)
  const shouldHideFooter = location.pathname.startsWith('/news');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;