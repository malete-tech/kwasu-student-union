"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Partner, AdPlacement as AdPlacementType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShieldCheck, Target } from "lucide-react";
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

  // Show the first active ad for this placement
  const ad = ads[0]!;

  return (
    <Card className={cn(
      "relative overflow-hidden group h-[380px] rounded-2xl border-none shadow-xl transition-all duration-500 hover:shadow-2xl",
      className
    )}>
      {/* Background Visual (Logo with blur or solid brand color) */}
      <div className="absolute inset-0 bg-brand-900 flex items-center justify-center overflow-hidden">
        {ad.logoUrl ? (
          <>
            <img
              src={ad.logoUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20 blur-xl scale-110"
            />
            <img
              src={ad.logoUrl}
              alt={ad.name}
              className="relative z-10 max-h-[180px] max-w-[80%] object-contain transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </>
        ) : (
          <Target className="h-24 w-24 text-brand-800 opacity-50" />
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-brand-gold border-brand-gold/30 bg-black/40 backdrop-blur-md">
          Sponsored
        </Badge>
        {ad.isVerified && (
          <Badge className="bg-brand-500/20 text-brand-400 border-none backdrop-blur-md flex items-center gap-1 text-[9px] font-bold">
            <ShieldCheck className="h-3 w-3" /> Verified
          </Badge>
        )}
      </div>

      {/* Content Positioned Bottom */}
      <div className="absolute bottom-0 left-0 p-6 w-full z-20 transform transition-transform duration-500 group-hover:-translate-y-1">
        <h4 className="text-white text-xl font-bold leading-tight mb-1 group-hover:text-brand-gold transition-colors">
          {ad.name}
        </h4>
        <p className="text-brand-gold/80 text-xs font-bold uppercase tracking-wider mb-3">
          {ad.category}
        </p>
        <p className="text-white/70 text-sm line-clamp-2 leading-relaxed mb-4">
          {ad.description}
        </p>
        
        {ad.websiteUrl && (
          <a 
            href={ad.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-600 px-4 py-2 rounded-xl transition-all shadow-lg"
          >
            Learn More <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Click-through Overlay */}
      {ad.websiteUrl && (
        <a 
          href={ad.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 z-10"
          aria-label={`Visit ${ad.name}`}
        />
      )}
    </Card>
  );
};

export default AdPlacement;