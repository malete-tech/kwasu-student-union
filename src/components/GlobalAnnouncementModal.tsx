"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Megaphone, X, AlertTriangle, PartyPopper } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

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

  const LOCAL_STORAGE_KEY = "kwasu_su_announcement_dismissed_id";

  const fetchAnnouncement = useCallback(async () => {
    try {
      const activeAnnouncement = await api.announcements.getActive();
      if (activeAnnouncement) {
        const dismissedId = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        // Only show if the announcement ID is new or hasn't been dismissed
        if (activeAnnouncement.id !== dismissedId) {
          setAnnouncement(activeAnnouncement);
          setIsOpen(true);
        }
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
    if (announcement) {
      localStorage.setItem(LOCAL_STORAGE_KEY, announcement.id);
    }
    setIsOpen(false);
  };

  if (loading || !announcement) {
    return null;
  }

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
        return 'bg-yellow-100 border-b border-brand-gold/50 text-brand-700';
      case 'info':
      default:
        return 'bg-blue-100 border-b border-blue-500/50 text-blue-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className={cn("flex items-center p-4", getHeaderClasses(announcement.type))}>
          {getIcon(announcement.type)}
          <DialogTitle className="ml-3 text-xl font-bold flex-1">
            {announcement.title}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="text-current hover:bg-transparent">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <DialogDescription className="prose max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {announcement.messageMd}
            </ReactMarkdown>
          </DialogDescription>
        </div>
        <div className="p-4 border-t flex justify-end">
          <Button onClick={handleDismiss} className="bg-brand-500 hover:bg-brand-600 text-white">
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAnnouncementModal;