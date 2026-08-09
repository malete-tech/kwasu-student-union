"use client";

import React from "react";
import { Bell, BellRing, Volume2 } from "@/components/ui/font-awesome-icon";
import { Button } from "@/components/ui/button";
import { useComplaintNotifications } from "@/hooks/useComplaintNotifications";

export const NotificationToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { permission, requestPermission, sendTestNotification } = useComplaintNotifications();

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={sendTestNotification}
          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded bg-brand-50 border border-brand-200 text-brand-800 hover:bg-brand-100 text-xs font-bold transition-colors shrink-0 ${className}`}
          title="Phone & Desktop alerts are active. Click to test sound chime and notification."
        >
          <BellRing className="w-3.5 h-3.5 text-brand-700 animate-pulse shrink-0" />
          <span className="hidden md:inline text-[11px]">Alerts Active</span>
          <Volume2 className="w-3 h-3 text-brand-600 ml-0.5 shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={requestPermission}
      className={`h-8 px-2 sm:px-2.5 border-brand-300 text-brand-900 hover:bg-brand-50 text-xs font-bold rounded flex items-center gap-1.5 shrink-0 ${className}`}
      title="Enable real-time phone & desktop notifications for new complaints"
    >
      <Bell className="w-3.5 h-3.5 text-brand-700 shrink-0" />
      <span className="hidden md:inline text-[11px]">Enable Alerts</span>
    </Button>
  );
};
