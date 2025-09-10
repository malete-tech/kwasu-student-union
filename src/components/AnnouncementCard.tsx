"use client";

import React from "react";
import { Card } from "@/components/ui/card"; // Removed CardContent
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellRing } from "lucide-react"; // Removed Megaphone
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  avatarUrl?: string;
  className?: string;
  style?: React.CSSProperties; // Added style prop
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  description,
  icon: Icon = BellRing,
  avatarUrl,
  className,
  style, // Accept the style prop
}) => {
  return (
    <Card className={cn("flex items-center p-4 bg-white/30 backdrop-blur-sm shadow-md rounded-xl border border-white/30 h-[80px]", className)} style={style}> {/* Apply the style prop */}
      <Avatar className="h-10 w-10 mr-4 flex-shrink-0">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={title} />
        ) : (
          <AvatarFallback className="bg-brand-100 text-brand-700">
            <Icon className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-grow overflow-hidden">
        <h4 className="font-semibold text-brand-800 text-base truncate">{title}</h4>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>
    </Card>
  );
};

export default AnnouncementCard;