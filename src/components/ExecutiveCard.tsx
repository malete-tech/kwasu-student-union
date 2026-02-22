"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Executive } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface ExecutiveCardProps {
  executive: Executive;
  className?: string;
}

const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ executive, className }) => {
  return (
    <Card className={cn(
      "relative overflow-hidden group h-[380px] rounded-2xl border-none shadow-xl transition-all duration-500 hover:shadow-2xl", 
      className
    )}>
      {/* Background Image */}
      {executive.photoUrl ? (
        <img
          src={executive.photoUrl}
          alt={executive.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-brand-100 flex items-center justify-center">
          <User className="h-24 w-24 text-brand-300" />
        </div>
      )}

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content Positioned Bottom Left */}
      <div className="absolute bottom-0 left-0 p-5 w-full transform transition-transform duration-500 group-hover:-translate-y-1">
        <Link 
          to={`/executives/${executive.slug}`} 
          className="block group/link outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm"
        >
          <h3 className="text-white text-xl font-bold leading-tight group-hover/link:text-brand-gold transition-colors line-clamp-1">
            {executive.name}
          </h3>
        </Link>
        <p className="text-brand-gold text-sm font-bold uppercase tracking-wider mt-1">
          {executive.role}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {executive.faculty && (
            <p className="text-white/80 text-xs font-medium border-l-2 border-brand-gold pl-2 line-clamp-1">
              {executive.faculty}
            </p>
          )}
          <span className="text-white/40 text-[10px] ml-auto">
            {executive.tenureStart.substring(0, 4)} - {executive.tenureEnd.substring(0, 4)}
          </span>
        </div>
      </div>

      {/* Quick View Button / Interaction State */}
      <Link 
        to={`/executives/${executive.slug}`} 
        className="absolute inset-0 z-10"
        aria-label={`View profile of ${executive.name}`}
      />
    </Card>
  );
};

export default ExecutiveCard;