"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Target, ShieldCheck, Play, Pause, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Partner } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deleteImageFromCloudinary, getCloudinaryPublicId } from "@/utils/cloudinary-upload";
import { useSession } from "@/components/SessionContextProvider";
import { format } from "date-fns";

const PartnersManagement: React.FC = () => {
  const { session } = useSession();
  const [ads, setAds] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.partners.getAll();
      setAds(data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setError("Failed to load ad campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleToggleStatus = async (ad: Partner) => {
    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    try {
      await api.partners.update(ad.id, { status: newStatus });
      toast.success(`Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}.`);
      setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: newStatus } : a));
    } catch (error) {
      toast.error("Failed to update campaign status.");
    }
  };

  const handleDelete = async (ad: Partner) => {
    if (!session?.access_token) return;
    setDeletingId(ad.id);
    try {
      if (ad.logoUrl) {
        const publicId = getCloudinaryPublicId(ad.logoUrl);
        if (publicId) await deleteImageFromCloudinary(publicId, session.access_token);
      }
      await api.partners.delete(ad.id);
      toast.success("Campaign removed.");
      setAds((prev) => prev.filter((p) => p.id !== ad.id));
    } catch (error) {
      toast.error("Failed to delete campaign.");
    } finally {
      setDeletingId(null);
    }
  };

  const getPlacementLabel = (p: string) => {
    switch(p) {
      case 'news_feed': return 'News Feed';
      case 'events_feed': return 'Events Page';
      case 'opportunities_feed': return 'Opportunities';
      default: return p;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-brand-900 uppercase tracking-tight">Partnerships</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Commercial & Sponsorship Desk</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-xl h-10 px-6 transition-all">
          <Link to="/partners/add">
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center text-destructive">{error}</div>
        ) : ads.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <Target className="mx-auto h-12 w-12 text-brand-200 mb-4" />
            <h3 className="text-lg font-bold">No active campaigns</h3>
            <p className="text-muted-foreground">Start monetizing by adding your first advertiser.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {ads.map((ad) => (
              <div 
                key={ad.id} 
                className={cn(
                  "group relative flex flex-col md:flex-row md:items-center justify-between rounded-2xl border transition-all duration-300 overflow-hidden",
                  ad.status === 'active' ? "bg-white border-brand-100 shadow-sm" : "bg-slate-50 border-slate-200 opacity-75"
                )}
              >
                {/* Info Section */}
                <div className="flex items-start p-4 md:p-5 gap-4 md:gap-5 flex-1 min-w-0">
                  <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-white border border-brand-50 flex items-center justify-center p-2 flex-shrink-0 shadow-inner">
                    {ad.logoUrl ? (
                      <img src={ad.logoUrl} alt={ad.name} className="h-full w-full object-contain" />
                    ) : (
                      <Target className="h-6 w-6 text-brand-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 truncate">{ad.name}</h3>
                      <Badge className={cn(
                        "text-[9px] md:text-[10px] h-4 px-1.5 uppercase font-bold tracking-wider",
                        ad.status === 'active' ? "bg-green-500" : "bg-slate-400"
                      )}>
                        {ad.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-slate-500">
                      <div className="flex flex-wrap gap-1">
                        {ad.placements.map(p => (
                          <span key={p} className="flex items-center gap-1 font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full text-[9px] md:text-[10px]">
                            <Target className="h-2.5 w-2.5" /> {getPlacementLabel(p)}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {format(new Date(ad.startDate), "MMM dd")}
                      </span>
                      {ad.isVerified && <ShieldCheck className="h-3 w-3 text-brand-500" />}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2 p-3 md:p-5 bg-slate-50/50 md:bg-transparent border-t md:border-t-0 border-slate-100 flex-shrink-0 justify-end">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleToggleStatus(ad)}
                    className={cn(
                      "h-9 w-9 rounded-xl border-slate-200 bg-white shadow-sm",
                      ad.status === 'active' ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                    )}
                  >
                    {ad.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button asChild variant="outline" size="sm" className="h-9 px-4 bg-white border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 rounded-xl shadow-sm">
                    <Link to={`/partners/edit/${ad.id}`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={deletingId === ad.id} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl">
                        {deletingId === ad.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl w-[95vw] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>End campaign?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove the ad for <span className="font-bold">"{ad.name}"</span>. This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-xl mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(ad)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">Delete Campaign</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersManagement;
