"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { History } from "@/components/ui/font-awesome-icon";

interface ExecutiveCouncilHeaderProps {
  title: string;
  subtitle: string;
  activeCouncil: "Central" | "Senate" | "Judiciary" | "Past";
}

const tabs = [
  { label: "Central Executive", path: "/executives/central", key: "Central" },
  { label: "Senate Council", path: "/executives/senate", key: "Senate" },
  { label: "Judiciary Council", path: "/executives/judiciary", key: "Judiciary" },
  { label: "Past Executives Archive", path: "/executives/past", key: "Past", icon: true },
];

export const ExecutiveCouncilHeader: React.FC<ExecutiveCouncilHeaderProps> = ({
  title,
  subtitle,
  activeCouncil,
}) => {
  return (
    <>
      {/* Page Banner */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

        <div className="container relative py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              KWASU Students' Union Leadership
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              {title.split(" ")[0]}{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                {title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Council Navigation Filter Bar */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const isActive = activeCouncil === tab.key;
              return (
                <Link
                  key={tab.key}
                  to={tab.path}
                  className={cn(
                    "h-8 px-3.5 rounded text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border",
                    isActive
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700"
                  )}
                  id={`tab-${tab.key.toLowerCase()}`}
                >
                  {tab.icon && <History className={cn("h-3.5 w-3.5", isActive ? "text-brand-gold" : "text-brand-500")} />}
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
