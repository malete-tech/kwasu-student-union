"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className }) => {
  return (
    <div className={cn("relative group", className)}>
      {/* Hardware Buttons - Left Side (Volume & Mute) */}
      <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-gray-800 rounded-l-sm z-0"></div>
      <div className="absolute -left-[2px] top-40 w-[3px] h-14 bg-gray-800 rounded-l-sm z-0 shadow-sm"></div>
      <div className="absolute -left-[2px] top-56 w-[3px] h-14 bg-gray-800 rounded-l-sm z-0 shadow-sm"></div>

      {/* Hardware Button - Right Side (Power) */}
      <div className="absolute -right-[2px] top-44 w-[3px] h-20 bg-gray-800 rounded-r-sm z-0 shadow-sm"></div>

      {/* Outer Frame (The 'Steel' look) */}
      <div className={cn(
        "relative w-[320px] h-[640px] md:w-[360px] md:h-[720px] rounded-[3.5rem] p-[10px] shadow-2xl",
        "bg-gradient-to-b from-[#2e2e2e] via-[#1a1a1a] to-[#000000] border-[1px] border-white/10",
        "after:absolute after:inset-0 after:rounded-[3.5rem] after:border-[0.5px] after:border-white/20 after:pointer-events-none"
      )}>
        {/* Inner Black Bezel */}
        <div className="relative w-full h-full bg-black rounded-[2.8rem] overflow-hidden shadow-inner ring-1 ring-white/5">
          
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-[20px] z-50 flex items-center justify-center">
            {/* Camera/Sensor Details within Island */}
            <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border-[0.5px] border-white/5"></div>
              <div className="w-4 h-4 rounded-full bg-[#0a0a0a] ring-[0.5px] ring-white/10 relative overflow-hidden">
                <div className="absolute inset-1 rounded-full bg-blue-900/20 blur-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Phone Screen Content */}
          <div className="relative w-full h-full bg-white overflow-hidden z-10">
            {children}
            
            {/* Screen Glare/Reflectance Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 mix-blend-overlay z-20"></div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-black/20 rounded-full z-40 backdrop-blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;