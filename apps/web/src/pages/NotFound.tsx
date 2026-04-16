"use client";

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Newspaper, CalendarDays } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | KWASU SU</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-brand-50 px-6 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Illustration/Icon Area */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-brand-200 blur-3xl rounded-full opacity-30 scale-150"></div>
            <div className="relative bg-white p-8 rounded-full shadow-xl border border-brand-100">
              <Search className="h-24 w-24 text-brand-500 animate-pulse" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-extrabold text-brand-900 tracking-tighter">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-700 uppercase">
              Lost in the Campus?
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to a new location.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl px-8 h-14 shadow-lg transition-all hover:scale-105">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" /> Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-brand-200 text-brand-700 hover:bg-brand-50 rounded-xl px-8 h-14 shadow-sm">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
              </button>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-12 border-t border-brand-100">
            <p className="text-sm font-semibold text-brand-400 uppercase tracking-widest mb-6">
              Try these instead
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Link 
                to="/news" 
                className="flex items-center p-4 bg-white rounded-2xl border border-brand-50 hover:border-brand-200 hover:shadow-md transition-all group"
              >
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Newspaper className="h-5 w-5" />
                </div>
                <span className="ml-3 font-bold text-slate-700">Latest News</span>
              </Link>
              <Link 
                to="/events" 
                className="flex items-center p-4 bg-white rounded-2xl border border-brand-50 hover:border-brand-200 hover:shadow-md transition-all group"
              >
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <span className="ml-3 font-bold text-slate-700">Upcoming Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;