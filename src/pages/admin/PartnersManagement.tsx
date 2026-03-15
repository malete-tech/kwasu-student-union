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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Ad Management Center</h2>
          <p className="text-muted-foreground mt-1">Manage sponsored content and advertiser campaigns across the platform.</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-md">
          <Link to="/admin/partners/add">
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
                  "group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                  ad.status === 'active' ? "bg-white border-brand-100 shadow-sm" : "bg-slate-50 border-slate-200 opacity-75"
                )}
              >
                <div className="flex items-start space-x-5 flex-1 min-w-0">
                  <div className="h-16 w-16 rounded-xl bg-white border border-brand-50 flex items-center justify-center p-2 flex-shrink-0 shadow-inner">
                    {ad.logoUrl ? (
                      <img src={ad.logoUrl} alt={ad.name} className="h-full w-full object-contain" />
                    ) : (
                      <Target className="h-6 w-6 text-brand-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{ad.name}</h3>
                      <Badge className={cn(
                        "text-[10px] h-4 px-1.5",
                        ad.status === 'active' ? "bg-green-500" : "bg-slate-400"
                      )}>
                        {ad.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-brand-600">
                        <Target className="h-3 w-3" /> {getPlacementLabel(ad.placement)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Starts: {format(new Date(ad.startDate), "MMM dd")}
                      </span>
                      {ad.isVerified && <ShieldCheck className="h-3 w-3 text-brand-500" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggleStatus(ad)}
                    className={cn(
                      "h-9 w-9 rounded-xl",
                      ad.status === 'active' ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                    )}
                  >
                    {ad.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button asChild variant="outline" size="sm" className="h-9 px-4 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl">
                    <Link to={`/admin/partners/edit/${ad.id}`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={deletingId === ad.id} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl">
                        {deletingId === ad.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>End campaign?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove the ad for <span className="font-bold">"{ad.name}"</span>.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(ad)} className="bg-destructive">Delete</AlertDialogAction>
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