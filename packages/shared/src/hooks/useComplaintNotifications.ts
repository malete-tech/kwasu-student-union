"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Web Audio API notification alert chime generator
function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: A5 (880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: C6 (1046.5Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.15);
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

export function useComplaintNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const processedComplaintIds = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    playNotificationChime();

    if ("Notification" in window && Notification.permission === "granted") {
      const title = "Test Complaint Alert — KWASUSU ADMIN";
      const options = {
        body: "Real-time complaint alerts are active! You will be notified instantly when a student submits a complaint.",
        icon: "/logo.png",
        badge: "/logo.png",
        tag: "test-alert-" + Date.now(),
        vibrate: [200, 100, 200],
        data: { url: "/complaints" },
      };

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        try {
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification(title, options);
          return;
        } catch {
          // Fallback to standard Notification
        }
      }

      new Notification(title, options);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Browser does not support desktop/mobile push notifications.");
      return "denied";
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);

      if (res === "granted") {
        toast.success("Phone & Desktop alerts activated!");
        sendTestNotification();
      } else {
        toast.error("Notification permission was denied.");
      }
      return res;
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      return "denied";
    }
  }, [sendTestNotification]);

  const handleNewComplaint = useCallback(
    async (newComplaint: { id: string; category?: string; title: string; isAnonymous?: boolean; contactEmail?: string }) => {
      // Prevent duplicate notifications for the same complaint ID
      if (processedComplaintIds.current.has(newComplaint.id)) {
        return;
      }
      processedComplaintIds.current.add(newComplaint.id);

      // 1. Play sound chime unconditionally
      playNotificationChime();

      // 2. Trigger mobile & desktop push notification
      if ("Notification" in window && Notification.permission === "granted") {
        const categoryLabel = newComplaint.category ? `[${newComplaint.category}] ` : "";
        const submitter = newComplaint.isAnonymous
          ? "Anonymous Student"
          : newComplaint.contactEmail || "A Student";

        const notifTitle = `New Complaint: ${categoryLabel}${newComplaint.title}`;
        const notifOptions = {
          body: `Submitted by ${submitter}. Tap to open queue in KWASUSU ADMIN.`,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: newComplaint.id,
          vibrate: [200, 100, 200],
          data: { url: "/complaints" },
        };

        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(notifTitle, notifOptions);
          } catch {
            const notif = new Notification(notifTitle, notifOptions);
            notif.onclick = () => {
              window.focus();
              window.location.href = "/complaints";
            };
          }
        } else {
          const notif = new Notification(notifTitle, notifOptions);
          notif.onclick = () => {
            window.focus();
            window.location.href = "/complaints";
          };
        }
      }

      // 3. Trigger Sonner toast alert in admin console
      toast.info(`New Student Complaint Logged: ${newComplaint.title}`, {
        description: `Category: ${newComplaint.category || "General"}. Tap to open queue.`,
        duration: 10000,
        action: {
          label: "View Queue",
          onClick: () => {
            window.location.href = "/complaints";
          },
        },
      });
    },
    []
  );

  // 1. Subscribe to Supabase Realtime database changes on `complaints` table
  useEffect(() => {
    const channel = supabase
      .channel("realtime-admin-complaints")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "complaints" },
        (payload) => {
          if (payload.new && payload.new.id) {
            handleNewComplaint(
              payload.new as {
                id: string;
                category?: string;
                title: string;
                isAnonymous?: boolean;
                contactEmail?: string;
              }
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to Supabase Realtime complaint notifications.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleNewComplaint]);

  // 2. Safeguard Polling — check for new complaints every 5 seconds
  useEffect(() => {
    const checkLatestComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select("id, category, title, is_anonymous, contact_email, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error || !data) return;

        if (isInitialLoad.current) {
          // On initial load, mark existing complaints as seen so we don't spam old alerts
          data.forEach((item) => processedComplaintIds.current.add(item.id));
          isInitialLoad.current = false;
          return;
        }

        // Check for any unhandled new complaints
        for (const item of data) {
          if (!processedComplaintIds.current.has(item.id)) {
            handleNewComplaint({
              id: item.id,
              category: item.category,
              title: item.title,
              isAnonymous: item.is_anonymous,
              contactEmail: item.contact_email,
            });
          }
        }
      } catch (err) {
        console.warn("Error polling complaints safeguard:", err);
      }
    };

    // Initial check
    checkLatestComplaints();

    // Poll every 5 seconds
    const interval = setInterval(checkLatestComplaints, 5000);

    return () => clearInterval(interval);
  }, [handleNewComplaint]);

  return {
    permission,
    requestPermission,
    sendTestNotification,
    playNotificationChime,
  };
}
