"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Target, ShieldCheck, Play, Pause } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            Partnerships
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">({ads.length})</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Commercial &amp; sponsorship desk</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap shrink-0">
          <Link to="/partners/add">
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Link>
        </Button>
      </div>

      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-slate-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchAds} className="mt-3 rounded-md h-8 text-sm">Try Again</Button>
          </div>
        ) : ads.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No active campaigns</p>
              <p className="text-xs text-slate-400 mt-0.5">Add your first advertiser or sponsor</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center",
                  ad.status !== 'active' && "opacity-60"
                )}
              >
                {/* Content */}
                <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-md bg-white border border-slate-200 flex items-center justify-center p-1.5">
                    {ad.logoUrl ? (
                      <img src={ad.logoUrl} alt={ad.name} className="h-full w-full object-contain" />
                    ) : (
                      <Target className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <Badge className={cn(
                        "text-[10px] h-4 px-1.5 uppercase font-semibold tracking-wide border-0",
                        ad.status === 'active' ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {ad.status}
                      </Badge>
                      {ad.isVerified && (
                        <ShieldCheck className="h-3 w-3 text-brand-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">{ad.name}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {ad.placements.map(p => (
                        <span key={p} className="text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0 rounded font-medium">
                          {getPlacementLabel(p)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(ad)}
                    className={cn(
                      "h-8 w-8 sm:w-auto sm:px-3 rounded-md border-slate-200 text-xs shrink-0",
                      ad.status === 'active' ? "text-amber-600 hover:bg-amber-50 hover:border-amber-200" : "text-green-600 hover:bg-green-50 hover:border-green-200"
                    )}
                  >
                    {ad.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline ml-1.5">{ad.status === 'active' ? 'Pause' : 'Resume'}</span>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs">
                    <Link to={`/partners/edit/${ad.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={deletingId === ad.id} className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs">
                        {deletingId === ad.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete</>}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">End campaign?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">This will permanently remove the ad campaign for "{ad.name}".</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(ad)} className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9">Delete Campaign</AlertDialogAction>
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
