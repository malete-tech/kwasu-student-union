"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

// Uses the same announcement source as GlobalAnnouncementModal.
// Renders a slim persistent ticker bar when a live announcement exists.

const AnnouncementBanner: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await api.announcements.getActive();
        if (data) {
          setTitle(data.title);
          // Strip markdown for plain text ticker display
          setMessage(data.messageMd.replace(/[#*`_>]/g, "").split("\n")[0] ?? data.title);
        }
      } catch {
        // Silently fail — ticker is non-critical
      }
    };
    fetchAnnouncement();
  }, []);

  if (!message || dismissed) return null;

  return (
    <div
      className="relative bg-brand-gold text-brand-900 flex items-center justify-between px-4 py-2.5 text-xs font-bold"
      role="banner"
      aria-live="polite"
      id="announcement-ticker"
    >
      {/* Icon + scrolling text */}
      <div className="flex items-center gap-2 overflow-hidden">
        <i className="fa-solid fa-bullhorn flex-shrink-0 text-brand-900/70" aria-hidden="true" />
        <div className="overflow-hidden">
          <p className="truncate max-w-[70vw] sm:max-w-none">{message}</p>
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 ml-4 text-brand-900/60 hover:text-brand-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-900 rounded"
        aria-label="Dismiss announcement"
      >
        <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
