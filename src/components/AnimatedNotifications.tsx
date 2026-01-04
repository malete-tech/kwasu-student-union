"use client";

import React, { useEffect, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const latestNews = await api.news.getLatest(5);
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
    let intervalId: any;
    
    if (announcements.length > 1) {
      intervalId = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [announcements]);

  if (loading) {
    return (
      <div className={cn("w-full h-full p-6 flex flex-col justify-center items-center bg-gray-50", className)}>
        <Skeleton className="h-[100px] w-full mb-6 rounded-2xl" />
        <Skeleton className="h-[100px] w-full mb-6 rounded-2xl" />
        <Skeleton className="h-[100px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full h-full p-6 flex flex-col justify-center items-center text-destructive text-sm bg-gray-50", className)}>
        {error}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className={cn("w-full h-full p-6 flex flex-col justify-center items-center text-muted-foreground text-sm bg-gray-50", className)}>
        No announcements available.
      </div>
    );
  }

  const totalAnnouncements = announcements.length;
  const prevIndex = (activeIndex - 1 + totalAnnouncements) % totalAnnouncements;
  const nextIndex = (activeIndex + 1) % totalAnnouncements;

  const cardHeight = 110; 
  const verticalOffset = cardHeight + 16; 

  return (
    <div className={cn("relative w-full h-full bg-brand-50/30 flex flex-col items-center justify-center p-6 overflow-hidden", className)}>
      <div className="absolute top-12 left-6 text-2xl font-black text-brand-900/10 uppercase tracking-tighter">
        SU Updates
      </div>
      
      <div className="relative w-full h-full flex flex-col items-center justify-center mt-8">
        {totalAnnouncements > 1 && (
          <AnnouncementCard
            key={announcements[prevIndex]!.id + "-prev"}
            title={announcements[prevIndex]!.title}
            description={announcements[prevIndex]!.excerpt}
            className="absolute w-full transition-all duration-700 ease-in-out shadow-lg"
            style={{
              transform: `translateY(-${verticalOffset}px) scale(0.85)`,
              opacity: 0,
              zIndex: 1,
            }}
          />
        )}

        <AnnouncementCard
          key={announcements[activeIndex]!.id + "-current"}
          title={announcements[activeIndex]!.title}
          description={announcements[activeIndex]!.excerpt}
          className="absolute w-full transition-all duration-700 ease-in-out shadow-xl border-brand-200"
          style={{
            transform: `translateY(0px) scale(1)`,
            opacity: 1,
            zIndex: 10,
          }}
        />

        {totalAnnouncements > 1 && (
          <AnnouncementCard
            key={announcements[nextIndex]!.id + "-next"}
            title={announcements[nextIndex]!.title}
            description={announcements[nextIndex]!.excerpt}
            className="absolute w-full transition-all duration-700 ease-in-out shadow-md"
            style={{
              transform: `translateY(${verticalOffset}px) scale(0.9)`,
              opacity: 0.5,
              zIndex: 5,
            }}
          />
        )}
      </div>

      <div className="absolute bottom-12 flex gap-1.5">
        {announcements.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex ? "w-4 bg-brand-600" : "w-1.5 bg-brand-200"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedNotifications;