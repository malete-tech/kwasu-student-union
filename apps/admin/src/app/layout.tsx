"use client";

import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GlobalAnnouncementModal from "@/components/GlobalAnnouncementModal";
import PageTransition from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";

const Layout = () => {
  const location = useLocation();
  
  const shouldHideFooter = location.pathname.startsWith('/news');
  const shouldShowAnnouncement = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      {!shouldHideFooter && <Footer />}
      {shouldShowAnnouncement && <GlobalAnnouncementModal />}
    </div>
  );
};

export default Layout;
