import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Star, 
  Handshake,
  Megaphone,
  PlusCircle,
  List
} from "lucide-react";
import React from "react";

export interface NavChild {
  name: string;
  href: string;
  icon?: React.ElementType;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavChild[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard 
  },
  { 
    name: "News", 
    href: "/news", 
    icon: Newspaper,
    children: [
      { name: "Manage News", href: "/news", icon: List },
      { name: "Add Article", href: "/news/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Events", 
    href: "/events", 
    icon: Calendar,
    children: [
      { name: "Manage Events", href: "/events", icon: List },
      { name: "Add Event", href: "/events/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Executives", 
    href: "/executives", 
    icon: Users,
    children: [
      { name: "Manage Executives", href: "/executives", icon: List },
      { name: "Add Executive", href: "/executives/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Documents", 
    href: "/documents", 
    icon: FileText,
    children: [
      { name: "Manage Vault", href: "/documents", icon: List },
      { name: "Upload Document", href: "/documents/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Opportunities", 
    href: "/opportunities", 
    icon: Briefcase,
    children: [
      { name: "Manage All", href: "/opportunities", icon: List },
      { name: "Post New", href: "/opportunities/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Spotlight", 
    href: "/spotlight", 
    icon: Star,
    children: [
      { name: "Manage Spotlight", href: "/spotlight", icon: List },
      { name: "Add Student", href: "/spotlight/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Complaints", 
    href: "/complaints", 
    icon: MessageSquare 
  },
  { 
    name: "Partners", 
    href: "/partners", 
    icon: Handshake,
    children: [
      { name: "Manage Partners", href: "/partners", icon: List },
      { name: "Add Partner", href: "/partners/add", icon: PlusCircle },
    ]
  },
  { 
    name: "Announcements", 
    href: "/announcements", 
    icon: Megaphone 
  },
];
