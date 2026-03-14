"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Handshake, ShieldCheck, ExternalLink } from "lucide-react";
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
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.partners.getAll();
      setPartners(data);
    } catch (err) {
      console.error("Failed to fetch partners:", err);
      setError("Failed to load partners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = async (partner: Partner) => {
    if (!session?.access_token) {
      toast.error("Authentication token missing.");
      return;
    }

    setDeletingId(partner.id);
    try {
      // 1. Delete image from Cloudinary if it exists
      if (partner.logoUrl) {
        const publicId = getCloudinaryPublicId(partner.logoUrl);
        if (publicId) {
          await deleteImageFromCloudinary(publicId, session.access_token);
        }
      }

      // 2. Delete record from DB
      await api.partners.delete(partner.id);
      toast.success(`Partner "${partner.name}" removed successfully!`);
      setPartners((prev) => prev.filter((p) => p.id !== partner.id));
    } catch (error) {
      console.error("Failed to delete partner:", error);
      toast.error("Failed to delete partner.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Partners Directory</h2>
          <p className="text-muted-foreground mt-1">Manage organizations and businesses in good standing with the SU.</p>
        </div>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md">
          <Link to="/admin/partners/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Partner
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" onClick={fetchPartners} className="mt-4 rounded-xl">Try Again</Button>
          </div>
        ) : partners.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <Handshake className="mx-auto h-12 w-12 text-brand-200 mb-4" />
            <h3 className="text-lg font-bold">No partners listed</h3>
            <p className="text-muted-foreground">Start by adding organizations that support the SU.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <div 
                key={partner.id} 
                className={cn(
                  "group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                  "bg-white/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-md shadow-sm"
                )}
              >
                <div className="flex items-start space-x-5 flex-1 min-w-0">
                  <div className="h-14 w-14 rounded-xl bg-white border border-brand-50 flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
                    {partner.logoUrl ? (
                      <img src={partner.logoUrl} alt={partner.name} className="h-full w-full object-contain" />
                    ) : (
                      <Handshake className="h-6 w-6 text-brand-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {partner.name}
                      </h3>
                      {partner.isVerified && (
                        <ShieldCheck className="h-4 w-4 text-brand-500" />
                      )}
                      {partner.tier === 'premium' && (
                        <Badge className="bg-brand-gold text-brand-900 text-[10px] h-4 px-1.5">Premium</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                      {partner.category} • {partner.description.substring(0, 80)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                  {partner.websiteUrl && (
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-brand-500 hover:bg-brand-50 rounded-xl">
                      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  
                  <Button asChild variant="outline" size="sm" className="h-9 px-4 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl">
                    <Link to={`/admin/partners/edit/${partner.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={deletingId === partner.id} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl">
                        {deletingId === partner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove partner?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove <span className="font-bold">"{partner.name}"</span> from the directory.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(partner)} className="bg-destructive">Delete</AlertDialogAction>
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