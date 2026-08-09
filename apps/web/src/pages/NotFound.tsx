"use client";

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import FadeIn from "@/components/FadeIn";

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
      <SEO
        title="404 - Page Not Found | KWASU SU"
        description="The page you are looking for does not exist or has been moved."
        url="https://kwasusu.com.ng/404"
      />

      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 px-4 py-12">
        <FadeIn>
          <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded p-8">
            <div className="w-12 h-12 rounded bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-compass text-lg" aria-hidden="true" />
            </div>

            <span className="block text-4xl font-extrabold text-brand-900 tracking-tight mb-1">
              404
            </span>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              Page Not Found
            </h1>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              The page you are looking for doesn't exist, has been removed, or moved to a different web address.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 transition-colors"
              >
                <i className="fa-solid fa-house text-[10px]" aria-hidden="true" />
                Return Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-white text-gray-700 border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-[10px]" aria-hidden="true" />
                Go Back
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                Quick Navigation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  to="/news"
                  className="flex items-center gap-2.5 p-2.5 rounded border border-gray-100 hover:border-gray-300 bg-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-newspaper text-xs" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Latest News</span>
                </Link>

                <Link
                  to="/events"
                  className="flex items-center gap-2.5 p-2.5 rounded border border-gray-100 hover:border-gray-300 bg-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-calendar-days text-xs" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Events Calendar</span>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
};

export default NotFound;