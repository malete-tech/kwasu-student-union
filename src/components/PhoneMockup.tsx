"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "relative w-[340px] h-[500px] md:w-[380px] md:h-[560px] lg:w-[420px] lg:h-[620px] rounded-[3rem] shadow-2xl overflow-hidden",
      "bg-gradient-to-br from-brand-100 to-brand-400", // Gradient background for the border
      className
    )}>
      {/* Inner phone body, creating the border effect with an inset */}
      <div className="absolute inset-[10px] bg-gray-900/80 rounded-[2.5rem] overflow-hidden flex items-center justify-center">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-6 bg-gray-900/80 rounded-b-xl z-30"></div>
        
        {/* Phone Screen (where children will be rendered) */}
        <div className="relative w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[2.5rem] bg-white overflow-hidden z-10">
          {children}
        </div>

        {/* Speaker/Camera cutout (for visual detail) */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-700 rounded-full z-40"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;