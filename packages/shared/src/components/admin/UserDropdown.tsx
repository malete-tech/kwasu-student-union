import React from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

interface UserDropdownProps {
  userEmail?: string;
  avatarUrl?: string;
  onLogout: () => void;
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ 
  userEmail, 
  avatarUrl, 
  onLogout,
  className 
}) => {
  const initials = userEmail?.[0]?.toUpperCase() || "A";
  const displayName = userEmail?.split('@')[0] || "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 group",
          className
        )}>
          <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-brand-600 text-white font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[100px]">{displayName}</p>
            <p className="text-[10px] text-brand-600 font-medium mt-0.5">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-xl border-slate-100 mr-4" align="end">
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-100">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-slate-50 text-slate-400">
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-900 leading-none">{displayName}</p>
              <p className="text-xs text-slate-500 mt-1 truncate">{userEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-slate-50" />
        <DropdownMenuGroup className="space-y-1">
          <Link to="/profile">
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-brand-50 hover:text-brand-700 focus:bg-brand-50 focus:text-brand-700 group">
              <User className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              <span className="font-semibold text-sm">My Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2 bg-slate-50" />
        <DropdownMenuItem 
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-700 group"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="font-bold text-sm">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
