"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import AnnouncementCard from "@/components/AnnouncementCard";
import { api } from "@/lib/api";
import { News } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnimatedNotificationsProps {
  className?: string;
}

const AnimatedNotifications: React.FC<AnimatedNotificationsProps> = ({ className }) => {
  const [announcements, setAnnouncements] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Fetch some news items to act as announcements
        const latestNews = await api.news.getLatest(5); // Get 5 latest news
        setAnnouncements(latestNews);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white p-4 flex flex-col justify-center items-center", className)}>
        <Skeleton className="h-[80px] w-full mb-2" />
        <Skeleton className="h-[80px] w-full mb-2" />
        <Skeleton className="h-[80px] w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white p-4 flex flex-col justify-center items-center text-destructive text-sm", className)}>
        {error}
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white p-4 flex flex-col justify-center items-center text-muted-foreground text-sm", className)}>
        No announcements available.
      </Card>
    );
  }

  // To create an infinite loop, duplicate the announcements
  const loopedAnnouncements = [...announcements, ...announcements];

  return (
    <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white p-4", className)}>
      <div className="absolute inset-0 flex flex-col animate-slide-down-loop">
        {loopedAnnouncements.map((newsItem, index) => (
          <AnnouncementCard
            key={`${newsItem.id}-${index}`} // Unique key for duplicated items
            title={newsItem.title}
            description={newsItem.excerpt}
            className="mb-2 flex-shrink-0"
          />
        ))}
      </div>
    </Card>
  );
};

export default AnimatedNotifications;