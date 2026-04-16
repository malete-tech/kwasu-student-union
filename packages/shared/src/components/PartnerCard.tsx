"use client";

import React from "react";
import { Partner } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PartnerCardProps {
  partner: Partner;
  className?: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, className }) => {
  const isPremium = partner.tier === 'premium';

  return (
    <Card className={cn(
      "group flex flex-col overflow-hidden transition-all duration-300 rounded-2xl border-brand-50",
      isPremium ? "shadow-xl border-brand-200 bg-gradient-to-b from-white to-brand-50/30" : "shadow-md hover:shadow-lg bg-white",
      className
    )}>
      <CardHeader className="pb-2 relative">
        {isPremium && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-brand-gold text-brand-900 border-none flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" /> Featured
            </Badge>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-3">
          <div className="h-16 w-16 rounded-xl overflow-hidden border border-brand-100 bg-white flex items-center justify-center p-2 shadow-inner">
            {partner.logoUrl ? (
              <img src={partner.logoUrl} alt={partner.name} className="h-full w-full object-contain" />
            ) : (
              <div className="h-full w-full bg-brand-50 flex items-center justify-center text-brand-300">
                <i className="fa-solid fa-handshake text-2xl"></i>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-lg font-bold text-brand-900 truncate">
                {partner.name}
              </CardTitle>
              {partner.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldCheck className="h-5 w-5 text-brand-500 flex-shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-brand-800 text-white border-none">
                      <p className="text-xs font-medium">SU Verified: Good Standing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
              {partner.category}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {partner.description}
        </p>
      </CardContent>

      <CardFooter className="pt-4 border-t border-brand-50 mt-auto">
        {partner.websiteUrl ? (
          <Button asChild variant="outline" className="w-full rounded-xl border-brand-100 text-brand-700 hover:bg-brand-50 hover:text-brand-800 font-bold">
            <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Website <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button disabled variant="ghost" className="w-full rounded-xl text-muted-foreground italic text-xs">
            No website available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PartnerCard;