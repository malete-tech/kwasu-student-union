import React from "react";

export interface FontAwesomeIconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string;
  className?: string;
  size?: number | string;
  spin?: boolean;
}

// Icon Mapping table from Lucide icon names to FontAwesome CSS classes
const iconMap: Record<string, string> = {
  Search: "fa-solid fa-magnifying-glass",
  CalendarDays: "fa-solid fa-calendar-days",
  Calendar: "fa-solid fa-calendar-days",
  CalendarIcon: "fa-solid fa-calendar-days",
  Briefcase: "fa-solid fa-briefcase",
  User: "fa-solid fa-user",
  Users: "fa-solid fa-users",
  Edit: "fa-solid fa-pen-to-square",
  Trash2: "fa-solid fa-trash-can",
  Trash: "fa-solid fa-trash-can",
  PlusCircle: "fa-solid fa-circle-plus",
  Plus: "fa-solid fa-plus",
  Loader2: "fa-solid fa-spinner fa-spin",
  ChevronDown: "fa-solid fa-chevron-down",
  ChevronUp: "fa-solid fa-chevron-up",
  ChevronLeft: "fa-solid fa-chevron-left",
  ChevronRight: "fa-solid fa-chevron-right",
  ChevronsUpDown: "fa-solid fa-sort",
  ArrowLeft: "fa-solid fa-arrow-left",
  ArrowRight: "fa-solid fa-arrow-right",
  ExternalLink: "fa-solid fa-arrow-up-right-from-square",
  Download: "fa-solid fa-download",
  MapPin: "fa-solid fa-location-dot",
  Tag: "fa-solid fa-tag",
  Tags: "fa-solid fa-tags",
  Check: "fa-solid fa-check",
  CheckCircle2: "fa-solid fa-circle-check",
  Camera: "fa-solid fa-camera",
  X: "fa-solid fa-xmark",
  XCircle: "fa-solid fa-circle-xmark",
  AlertCircle: "fa-solid fa-triangle-exclamation",
  AlertTriangle: "fa-solid fa-triangle-exclamation",
  FileText: "fa-solid fa-file-lines",
  Image: "fa-solid fa-image",
  ImageIcon: "fa-solid fa-image",
  Upload: "fa-solid fa-upload",
  Bell: "fa-solid fa-bell",
  BellRing: "fa-solid fa-bell",
  Megaphone: "fa-solid fa-bullhorn",
  ShieldCheck: "fa-solid fa-shield-halved",
  Target: "fa-solid fa-bullseye",
  Play: "fa-solid fa-play",
  Pause: "fa-solid fa-pause",
  Clock: "fa-solid fa-clock",
  Mail: "fa-solid fa-envelope",
  Lock: "fa-solid fa-lock",
  LogOut: "fa-solid fa-right-from-bracket",
  Settings: "fa-solid fa-gear",
  Home: "fa-solid fa-house",
  Newspaper: "fa-solid fa-newspaper",
  History: "fa-solid fa-clock-rotate-left",
  RotateCcw: "fa-solid fa-rotate-left",
  List: "fa-solid fa-list-check",
  ListChecks: "fa-solid fa-list-check",
  Bold: "fa-solid fa-bold",
  Italic: "fa-solid fa-italic",
  Code: "fa-solid fa-code",
  Link: "fa-solid fa-link",
  Star: "fa-solid fa-star",
  Inbox: "fa-solid fa-inbox",
  GripVertical: "fa-solid fa-grip-vertical",
  Dot: "fa-solid fa-circle-dot",
  MoreHorizontal: "fa-solid fa-ellipsis",
  Circle: "fa-solid fa-circle",
  PanelLeft: "fa-solid fa-table-columns",
  PartyPopper: "fa-solid fa-champagne-glasses",
  TrendingUp: "fa-solid fa-chart-line",
  Paperclip: "fa-solid fa-paperclip",
  Layers: "fa-solid fa-layer-group",
  Linkedin: "fa-brands fa-linkedin",
  Twitter: "fa-brands fa-x-twitter",
  Instagram: "fa-brands fa-instagram",
  Phone: "fa-solid fa-phone",
  Layout: "fa-solid fa-table-cells-large",
  LayoutDashboard: "fa-solid fa-gauge",
  Handshake: "fa-solid fa-handshake",
  Sparkles: "fa-solid fa-sparkles",
  Eye: "fa-solid fa-eye",
  EyeOff: "fa-solid fa-eye-slash",
  Share2: "fa-solid fa-share-nodes",
  Bookmark: "fa-solid fa-bookmark",
  Heart: "fa-solid fa-heart",
  ThumbsUp: "fa-solid fa-thumbs-up",
  MessageSquare: "fa-solid fa-comment",
  GraduationCap: "fa-solid fa-graduation-cap",
  Building: "fa-solid fa-building",
  BookOpen: "fa-solid fa-book-open",
  Award: "fa-solid fa-award",
  HelpCircle: "fa-solid fa-circle-question",
  Info: "fa-solid fa-circle-info",
  Menu: "fa-solid fa-bars",
  ArrowUp: "fa-solid fa-arrow-up",
  ArrowDown: "fa-solid fa-arrow-down",
  RefreshCw: "fa-solid fa-arrows-rotate",
  Shield: "fa-solid fa-shield",
  Save: "fa-solid fa-floppy-disk",
  FileDown: "fa-solid fa-file-arrow-down",
  Sliders: "fa-solid fa-sliders",
  Filter: "fa-solid fa-filter",
};

export const FaIcon: React.FC<{ name: string } & FontAwesomeIconProps> = ({
  name,
  className = "",
  size,
  style,
  spin,
  ...props
}) => {
  const iconClass = iconMap[name] || `fa-solid fa-${name.toLowerCase()}`;
  const styleObj: React.CSSProperties = { ...style };

  if (typeof size === "number") {
    styleObj.fontSize = `${size}px`;
  }

  return (
    <i
      className={`inline-flex items-center justify-center text-center leading-none ${iconClass} ${spin ? "fa-spin" : ""} ${className}`.trim()}
      style={styleObj}
      {...props}
    />
  );
};

// Create named component generator helper
const createFaIcon = (iconName: string) => {
  const Component: React.FC<FontAwesomeIconProps> = (props) => (
    <FaIcon name={iconName} {...props} />
  );
  Component.displayName = `FaIcon(${iconName})`;
  return Component;
};

// Named Icon exports for Lucide compatibility
export const Search = createFaIcon("Search");
export const CalendarDays = createFaIcon("CalendarDays");
export const Calendar = createFaIcon("Calendar");
export const CalendarIcon = createFaIcon("CalendarIcon");
export const Briefcase = createFaIcon("Briefcase");
export const User = createFaIcon("User");
export const Users = createFaIcon("Users");
export const Edit = createFaIcon("Edit");
export const Trash2 = createFaIcon("Trash2");
export const Trash = createFaIcon("Trash");
export const PlusCircle = createFaIcon("PlusCircle");
export const Plus = createFaIcon("Plus");
export const Loader2 = createFaIcon("Loader2");
export const ChevronDown = createFaIcon("ChevronDown");
export const ChevronUp = createFaIcon("ChevronUp");
export const ChevronLeft = createFaIcon("ChevronLeft");
export const ChevronRight = createFaIcon("ChevronRight");
export const ChevronsUpDown = createFaIcon("ChevronsUpDown");
export const ArrowLeft = createFaIcon("ArrowLeft");
export const ArrowRight = createFaIcon("ArrowRight");
export const ExternalLink = createFaIcon("ExternalLink");
export const Download = createFaIcon("Download");
export const MapPin = createFaIcon("MapPin");
export const Tag = createFaIcon("Tag");
export const Tags = createFaIcon("Tags");
export const Check = createFaIcon("Check");
export const CheckCircle2 = createFaIcon("CheckCircle2");
export const Camera = createFaIcon("Camera");
export const X = createFaIcon("X");
export const XCircle = createFaIcon("XCircle");
export const AlertCircle = createFaIcon("AlertCircle");
export const AlertTriangle = createFaIcon("AlertTriangle");
export const FileText = createFaIcon("FileText");
export const Image = createFaIcon("Image");
export const ImageIcon = createFaIcon("ImageIcon");
export const Upload = createFaIcon("Upload");
export const Bell = createFaIcon("Bell");
export const BellRing = createFaIcon("BellRing");
export const Megaphone = createFaIcon("Megaphone");
export const ShieldCheck = createFaIcon("ShieldCheck");
export const Target = createFaIcon("Target");
export const Play = createFaIcon("Play");
export const Pause = createFaIcon("Pause");
export const Clock = createFaIcon("Clock");
export const Mail = createFaIcon("Mail");
export const Lock = createFaIcon("Lock");
export const LogOut = createFaIcon("LogOut");
export const Settings = createFaIcon("Settings");
export const Home = createFaIcon("Home");
export const Newspaper = createFaIcon("Newspaper");
export const History = createFaIcon("History");
export const RotateCcw = createFaIcon("RotateCcw");
export const List = createFaIcon("List");
export const ListChecks = createFaIcon("ListChecks");
export const Bold = createFaIcon("Bold");
export const Italic = createFaIcon("Italic");
export const Code = createFaIcon("Code");
export const Link = createFaIcon("Link");
export const Star = createFaIcon("Star");
export const Inbox = createFaIcon("Inbox");
export const GripVertical = createFaIcon("GripVertical");
export const Dot = createFaIcon("Dot");
export const MoreHorizontal = createFaIcon("MoreHorizontal");
export const Circle = createFaIcon("Circle");
export const PanelLeft = createFaIcon("PanelLeft");
export const PartyPopper = createFaIcon("PartyPopper");
export const TrendingUp = createFaIcon("TrendingUp");
export const Paperclip = createFaIcon("Paperclip");
export const Layers = createFaIcon("Layers");
export const Linkedin = createFaIcon("Linkedin");
export const Twitter = createFaIcon("Twitter");
export const Instagram = createFaIcon("Instagram");
export const Phone = createFaIcon("Phone");
export const Layout = createFaIcon("Layout");
export const LayoutDashboard = createFaIcon("LayoutDashboard");
export const Handshake = createFaIcon("Handshake");
export const Sparkles = createFaIcon("Sparkles");
export const Eye = createFaIcon("Eye");
export const EyeOff = createFaIcon("EyeOff");
export const Share2 = createFaIcon("Share2");
export const Bookmark = createFaIcon("Bookmark");
export const Heart = createFaIcon("Heart");
export const ThumbsUp = createFaIcon("ThumbsUp");
export const MessageSquare = createFaIcon("MessageSquare");
export const GraduationCap = createFaIcon("GraduationCap");
export const Building = createFaIcon("Building");
export const BookOpen = createFaIcon("BookOpen");
export const Award = createFaIcon("Award");
export const HelpCircle = createFaIcon("HelpCircle");
export const Info = createFaIcon("Info");
export const Menu = createFaIcon("Menu");
export const ArrowUp = createFaIcon("ArrowUp");
export const ArrowDown = createFaIcon("ArrowDown");
export const RefreshCw = createFaIcon("RefreshCw");
export const Shield = createFaIcon("Shield");
export const Save = createFaIcon("Save");
export const FileDown = createFaIcon("FileDown");
export const Sliders = createFaIcon("Sliders");
export const Filter = createFaIcon("Filter");
