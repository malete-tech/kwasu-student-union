"use client";

import React, { useEffect, useState } from "react";
import { X, Download, Share2, PlusCircle, Smartphone, Monitor, ShieldCheck } from "@/components/ui/font-awesome-icon";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallAppButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem("kwasu_pwa_installed") === "true";
    setIsInstalled(standalone);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem("kwasu_pwa_installed", "true");
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Hide button completely if app is already installed
  if (isInstalled) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        localStorage.setItem("kwasu_pwa_installed", "true");
        setDeferredPrompt(null);
      }
    } else {
      localStorage.removeItem("kwasu_pwa_banner_dismissed");
      window.location.reload();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`h-8 px-2.5 border-brand-300 text-brand-900 hover:bg-brand-50 text-xs font-bold rounded flex items-center gap-1.5 ${className}`}
      title="Install KWASUSU ADMIN App on Desktop or Mobile"
    >
      <Download className="w-3.5 h-3.5 text-brand-700" />
      <span className="hidden md:inline text-[11px]">Install Desktop App</span>
    </Button>
  );
};

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode or already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem("kwasu_pwa_installed") === "true";

    if (isStandalone) {
      return;
    }

    // Check local storage dismissal
    const isDismissed = localStorage.getItem("kwasu_pwa_banner_dismissed");
    if (isDismissed) {
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !/crios|fxios/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      setShowBanner(true);
    }

    // Listen for appinstalled event to suppress prompt once installed
    const handleAppInstalled = () => {
      setShowBanner(false);
      localStorage.setItem("kwasu_pwa_installed", "true");
    };

    // Listen for Android/Chrome/Desktop beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(!showIosGuide);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      localStorage.setItem("kwasu_pwa_installed", "true");
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("kwasu_pwa_banner_dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-auto animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="bg-brand-900/95 backdrop-blur-md text-white border border-brand-700/60 shadow-2xl rounded-2xl p-4 relative overflow-hidden">
        {/* Top subtle gold accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-brand-300 to-brand-gold" />

        <div className="flex items-start justify-between gap-3">
          {/* Logo badge + Text */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-800 flex items-center justify-center shrink-0 shadow-md p-1.5">
              <img src="/logo.png" alt="KWASU SU" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-white tracking-wide">
                  KWASUSU ADMIN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-brand-200 leading-snug">
                {isIos
                  ? "Install on your iPhone Home Screen for instant access & complaint alerts."
                  : "Install the console on your Desktop (Windows/Mac) or mobile phone for full native app experience."}
              </p>
            </div>
          </div>

          {/* Dismiss X */}
          <button
            onClick={handleDismiss}
            className="text-brand-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-3.5 pt-3 border-t border-brand-800/80 flex items-center justify-between gap-3">
          <span className="text-[10px] text-brand-400 font-medium flex items-center gap-1">
            <Monitor className="w-3 h-3 text-brand-gold" /> Desktop (Windows/Mac) & Mobile
          </span>

          <Button
            onClick={handleInstallClick}
            size="sm"
            className="h-8 bg-brand-gold hover:bg-brand-gold/90 text-brand-950 font-bold text-xs px-3.5 rounded-lg shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {isIos ? (showIosGuide ? "Hide Guide" : "Install Instructions") : "Install App"}
          </Button>
        </div>

        {/* Step-by-Step iOS Guide */}
        {isIos && showIosGuide && (
          <div className="mt-3 pt-3 border-t border-brand-800/80 space-y-2 text-[11px] text-brand-200 animate-in fade-in duration-200">
            <p className="font-bold text-brand-gold text-xs">How to Install on iOS Safari:</p>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed bg-brand-950/60 p-2.5 rounded-xl border border-brand-800">
              <li>
                Tap the <strong className="text-white inline-flex items-center gap-1"><Share2 className="w-3 h-3 text-brand-gold" /> Share</strong> icon in Safari's bottom bar.
              </li>
              <li>
                Scroll down and tap <strong className="text-white inline-flex items-center gap-1"><PlusCircle className="w-3 h-3 text-brand-gold" /> Add to Home Screen</strong>.
              </li>
              <li>Launch **KWASUSU ADMIN** directly from your iPhone home screen!</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
