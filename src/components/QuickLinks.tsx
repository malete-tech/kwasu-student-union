"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickLinkItemProps {
  icon: string;
  text: string;
  href: string;
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ icon, text, href }) => (
  <Link to={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-50 transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 outline-none">
    <i className={`${icon} w-5 text-center text-brand-600`}></i>
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
        <QuickLinkItem icon="fa-solid fa-comment-dots" text="Submit Complaint" href="/services/complaints" />
        <QuickLinkItem icon="fa-solid fa-calendar-check" text="Check Events" href="/events" />
        <QuickLinkItem icon="fa-solid fa-newspaper" text="View News" href="/news" />
        <QuickLinkItem icon="fa-solid fa-users" text="View Executives" href="/executives/central" />
      </CardContent>
    </Card>
  );
};

export default QuickLinks;