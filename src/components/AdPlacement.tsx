"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Partner, AdPlacement as AdPlacementType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdPlacementProps {
  placement: AdPlacementType;
  className?: string;
}

const AdPlacement: React.FC<AdPlacementProps> = ({ placement, className }) => {
  const [ads, setAds] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await api.partners.getByPlacement(placement);
        setAds(activeAds);
      } catch (error) {
        console.error("Failed to load ads for placement:", placement, error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [placement]);

  if (loading || ads.length === 0) return null;

  // For now, we show the first active ad for this placement
  const ad = ads[0]!;

  return (
    <Card className={cn(
      "relative overflow-hidden border-brand-100 bg-gradient-to-r from-brand-50/50 to-white p-4 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-brand-400 border-brand-100 bg-white">
          Sponsored
        </Badge>
        {ad.isVerified && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-brand-600">
            <ShieldCheck className="h-3 w-3" /> Verified Partner
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {ad.logoUrl && (
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-brand-50 bg-white p-1 flex-shrink-0">
            <img src={ad.logoUrl} alt={ad.name} className="h-full w-full object-contain" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-brand-900 text-sm truncate">{ad.name}</h4>
          <p className="text-xs text-slate-500 line-clamp-1">{ad.description}</p>
        </div>
        {ad.websiteUrl && (
          <a 
            href={ad.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-700 hover:text-white transition-all"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </Card>
  );
};

export default AdPlacement;