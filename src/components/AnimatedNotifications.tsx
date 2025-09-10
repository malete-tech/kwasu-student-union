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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // For pop-out animation

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

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setIsVisible(false); // Start fade-out
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
          setIsVisible(true); // Start fade-in
        }, 500); // Half of transition duration (must match CSS transition duration)
      }, 5000); // Change notification every 5 seconds
      return () => clearInterval(interval);
    }
  }, [announcements]);

  if (loading) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center", className)}>
        <Skeleton className="h-[80px] w-full mb-4" />
        <Skeleton className="h-[80px] w-full mb-4" />
        <Skeleton className="h-[80px] w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center text-destructive text-sm", className)}>
        {error}
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center text-muted-foreground text-sm", className)}>
        No announcements available.
      </Card>
    );
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <Card className={cn("relative w-full max-w-xs h-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center", className)}>
      <div className="relative w-full h-full flex items-center justify-center">
        <AnnouncementCard
          key={currentAnnouncement.id} // Key to trigger re-render and transition
          title={currentAnnouncement.title}
          description={currentAnnouncement.excerpt}
          className={cn(
            "absolute transition-all duration-500 ease-in-out",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        />
      </div>
    </Card>
  );
};

export default AnimatedNotifications;