"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Executive } from "@/types";
import { cn } from "@/lib/utils";
import { User } from "@/components/ui/font-awesome-icon";

interface ExecutiveCardProps {
  executive: Executive;
  className?: string;
}

const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ executive, className }) => {
  const tenureText = `${executive.tenureStart.substring(0, 4)}–${executive.tenureEnd.substring(0, 4)}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white border border-gray-100 rounded overflow-hidden transition-all duration-200 hover:border-brand-300 hover:shadow-md",
        className
      )}
      id={`executive-card-${executive.slug}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-brand-900 overflow-hidden">
        {executive.photoUrl ? (
          <img
            src={executive.photoUrl}
            alt={executive.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-950 text-brand-300">
            <User className="h-16 w-16 opacity-40 mb-2" aria-hidden="true" />
            <span className="text-[11px] font-medium tracking-wider uppercase opacity-50">KWASU SU</span>
          </div>
        )}

        {/* Gradient Overlay for photo readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Floating Tenure Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-brand-gold tracking-wider uppercase">
          {tenureText}
        </div>

        {/* Name & Role overlay at bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-[11px] font-bold text-brand-gold uppercase tracking-wider mb-0.5">
            {executive.role}
          </p>
          <h3 className="text-base font-bold text-white leading-tight group-hover:text-brand-gold transition-colors line-clamp-1">
            {executive.name}
          </h3>
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="p-3.5 bg-white border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium text-gray-700 truncate max-w-[70%]">
          {executive.faculty || `${executive.councilType} Council`}
        </span>
        <span className="inline-flex items-center text-[11px] font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform">
          Profile <i className="fa-solid fa-chevron-right text-[9px] ml-1" aria-hidden="true" />
        </span>
      </div>

      {/* Full Card Link Overlay */}
      <Link
        to={`/executives/${executive.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View full profile of ${executive.name}`}
      />
    </div>
  );
};

export default ExecutiveCard;