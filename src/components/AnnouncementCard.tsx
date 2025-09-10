"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellRing, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  avatarUrl?: string;
  className?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  description,
  icon: Icon = BellRing,
  avatarUrl,
  className,
}) => {
  return (
    <Card className={cn("flex items-center p-4 bg-white/80 backdrop-blur-sm shadow-md rounded-xl min-h-[80px] max-h-[80px] overflow-hidden", className)}>
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