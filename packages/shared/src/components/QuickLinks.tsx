"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickLinkItem {
  icon: string;
  label: string;
  href: string;
}

const links: QuickLinkItem[] = [
  { icon: "fa-solid fa-newspaper", label: "News", href: "/news" },
  { icon: "fa-solid fa-calendar-days", label: "Events", href: "/events" },
  { icon: "fa-solid fa-briefcase", label: "Services", href: "/services" },
  { icon: "fa-solid fa-comment-dots", label: "Submit Complaint", href: "/services/complaints" },
  { icon: "fa-solid fa-file-arrow-down", label: "Downloads", href: "/services/downloads" },
];

const QuickLinks: React.FC = () => {
  return (
    <div
      className="bg-white border-b border-gray-100"
      id="quick-access-bar"
      aria-label="Quick Access"
    >
      <div className="container">
        <div className="flex items-stretch overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden divide-x divide-gray-100">
          {links.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-2.5 px-5 py-4 shrink-0 text-xs font-bold text-gray-600",
                "hover:text-brand-700 hover:bg-brand-50 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
              )}
              id={`quick-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <i
                className={cn(item.icon, "text-sm text-brand-500 group-hover:text-brand-600 transition-colors")}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;