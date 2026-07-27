import React from "react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  className?: string;
  variant?: "default" | "brand" | "ghost";
}

export const HamburgerButton = React.forwardRef<HTMLButtonElement, HamburgerButtonProps>(
  ({ isOpen = false, className = "", variant = "default", ...props }, ref) => {
    const baseStyle =
      "relative inline-flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm active:scale-95 group";

    const variantStyles = {
      default: "bg-brand-50/80 hover:bg-brand-100/90 text-brand-800 border border-brand-200/80 shadow-sm",
      brand: "bg-brand-800/90 hover:bg-brand-800 text-white border border-brand-700/50 shadow-brand-900/30",
      ghost: "bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(baseStyle, variantStyles[variant], className)}
        aria-label="Toggle Navigation Menu"
        {...props}
      >
        <div className="w-5 h-4 flex flex-col justify-between items-end">
          <span
            className={cn(
              "h-[2.5px] rounded-full bg-current transition-all duration-300 ease-out origin-right",
              isOpen ? "w-5 -translate-x-[2px] translate-y-[3px] -rotate-45" : "w-5 group-hover:w-5"
            )}
          />
          <span
            className={cn(
              "h-[2.5px] rounded-full bg-current transition-all duration-300 ease-out",
              isOpen ? "w-0 opacity-0" : "w-3.5 group-hover:w-5"
            )}
          />
          <span
            className={cn(
              "h-[2.5px] rounded-full bg-current transition-all duration-300 ease-out origin-right",
              isOpen ? "w-5 -translate-x-[2px] -translate-y-[3px] rotate-45" : "w-4 group-hover:w-5"
            )}
          />
        </div>
      </button>
    );
  }
);

HamburgerButton.displayName = "HamburgerButton";
