"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CalendarDays, Newspaper, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickLinkItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ icon: Icon, text, href }) => (
  <Link to={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-50 transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none">
    <Icon className="h-5 w-5 text-brand-600" />
    <span className="text-base font-medium text-gray-800">{text}</span>
  </Link>
);

const QuickLinks: React.FC = () => {
  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-brand-700">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <QuickLinkItem icon={User} text="Submit Complaint" href="/services/complaints" />
        <QuickLinkItem icon={CalendarDays} text="Check Events" href="/events" />
        <QuickLinkItem icon={Newspaper} text="View News" href="/news" />
        <QuickLinkItem icon={Users} text="View Executives" href="/executives" />
      </CardContent>
    </Card>
  );
};

export default QuickLinks;