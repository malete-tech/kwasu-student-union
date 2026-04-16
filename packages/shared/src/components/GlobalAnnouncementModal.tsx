"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Megaphone, AlertTriangle, PartyPopper } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import Confetti from 'react-confetti'; // Import Confetti

interface GlobalAnnouncement {
  id: string;
  title: string;
  messageMd: string;
  type: 'urgent' | 'celebration' | 'info';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const GlobalAnnouncementModal: React.FC = () => {
  const [announcement, setAnnouncement] = useState<GlobalAnnouncement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  // Get window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAnnouncement = useCallback(async () => {
    try {
      const activeAnnouncement = await api.announcements.getActive();
      if (activeAnnouncement) {
        setAnnouncement(activeAnnouncement);
        setIsOpen(true); // Always open if an active announcement exists
      }
    } catch (error) {
      console.error("Failed to fetch global announcement:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (loading || !announcement) {
    return null;
  }

  const isCelebration = announcement.type === 'celebration';

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-8 w-8 text-destructive" />;
      case 'celebration':
        return <PartyPopper className="h-8 w-8 text-brand-gold" />;
      case 'info':
      default:
        return <Megaphone className="h-8 w-8 text-blue-500" />;
    }
  };

  const getHeaderClasses = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 border-b border-destructive/50 text-destructive';
      case 'celebration':
        return 'bg-brand-gold/20 border-b border-brand-gold text-brand-900';
      case 'info':
      default:
        return 'bg-blue-100 border-b border-blue-500/50 text-blue-700';
    }
  };

  const getButtonClasses = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-destructive hover:bg-destructive/90 text-white';
      case 'celebration':
        return 'bg-brand-gold hover:bg-brand-gold/90 text-brand-900';
      case 'info':
      default:
        return 'bg-brand-500 hover:bg-brand-600 text-white';
    }
  };

  return (
    <>
      {isCelebration && isOpen && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false} // Run once
          numberOfPieces={500}
          gravity={0.1}
          colors={['#FBBF24', '#10B981', '#3B82F6', '#EF4444']} // Gold, Green, Blue, Red
        />
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
          {/* Header Section */}
          <div className={cn("flex items-center p-4", getHeaderClasses(announcement.type))}>
            {getIcon(announcement.type)}
            <DialogTitle className="ml-3 text-xl font-bold flex-1">
              {announcement.title}
            </DialogTitle>
          </div>
          
          {/* Content Section */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <DialogDescription className="prose max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {announcement.messageMd}
              </ReactMarkdown>
            </DialogDescription>
          </div>
          
          {/* Footer Section */}
          <div className="p-4 border-t flex justify-end">
            <Button onClick={handleDismiss} className={getButtonClasses(announcement.type)}>
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalAnnouncementModal;