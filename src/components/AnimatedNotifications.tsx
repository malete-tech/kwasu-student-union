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
  const [activeIndex, setActiveIndex] = useState(0); // Index of the central "pop out" notification

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
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
        setActiveIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 5000); // Change notification every 5 seconds
      return () => clearInterval(interval);
    }
    return () => {}; // Ensure a cleanup function is always returned
  }, [announcements]);

  if (loading) {
    return (
      <Card className={cn("relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center", className)}>
        <Skeleton className="h-[80px] w-full mb-4" />
        <Skeleton className="h-[80px] w-full mb-4" />
        <Skeleton className="h-[80px] w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center text-destructive text-sm", className)}>
        {error}
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className={cn("relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-6 flex flex-col justify-center items-center text-muted-foreground text-sm", className)}>
        No announcements available.
      </Card>
    );
  }

  const totalAnnouncements = announcements.length;
  const prevIndex = (activeIndex - 1 + totalAnnouncements) % totalAnnouncements;
  const nextIndex = (activeIndex + 1) % totalAnnouncements;

  const cardHeight = 80; // From AnnouncementCard.tsx
  const verticalOffset = cardHeight + 8; // Card height + a small gap for stacking

  return (
    <Card className={cn("relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-4 flex flex-col justify-center items-center", className)}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Previous (Outgoing) Notification */}
        {totalAnnouncements > 1 && (
          <AnnouncementCard
            key={announcements[prevIndex]!.id + "-prev"}
            title={announcements[prevIndex]!.title}
            description={announcements[prevIndex]!.excerpt}
            className="absolute w-[90%] transition-all duration-500 ease-in-out"
            style={{
              transform: `translateY(-${verticalOffset}px) scale(0.9)`,
              opacity: 0.4,
              zIndex: 1,
            }}
          />
        )}

        {/* Current (Pop Out) Notification */}
        <AnnouncementCard
          key={announcements[activeIndex]!.id + "-current"}
          title={announcements[activeIndex]!.title}
          description={announcements[activeIndex]!.excerpt}
          className="absolute w-[90%] transition-all duration-500 ease-in-out"
          style={{
            transform: `translateY(0px) scale(1)`,
            opacity: 1,
            zIndex: 2,
          }}
        />

        {/* Next (Incoming) Notification */}
        {totalAnnouncements > 1 && (
          <AnnouncementCard
            key={announcements[nextIndex]!.id + "-next"}
            title={announcements[nextIndex]!.title}
            description={announcements[nextIndex]!.excerpt}
            className="absolute w-[90%] transition-all duration-500 ease-in-out"
            style={{
              transform: `translateY(${verticalOffset}px) scale(0.9)`,
              opacity: 0.4,
              zIndex: 1,
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default AnimatedNotifications;