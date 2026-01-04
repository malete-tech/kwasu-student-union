"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Star, ExternalLink, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Spotlight } from "@/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SpotlightManagement: React.FC = () => {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSpotlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.spotlight.getAll();
      setSpotlights(data);
    } catch (err) {
      console.error("Failed to fetch spotlights:", err);
      setError("Failed to load spotlight entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotlights();
  }, []);

  const deleteImageFromStorage = async (url: string): Promise<boolean> => {
    if (!url) return true;

    const bucketName = "student-spotlight-photos"; // Assuming this bucket exists
    const pathSegments = url.split('/');
    const fileNameWithFolder = pathSegments.slice(pathSegments.indexOf(bucketName) + 1).join('/');

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileNameWithFolder]);

    if (deleteError) {
      console.error("Error deleting image from storage:", deleteError);
      toast.error(`Image deletion from storage failed: ${deleteError.message}`);
      return false;
    }
    return true;
  };

  const handleDelete = async (spotlight: Spotlight) => {
    setDeletingId(spotlight.id);
    try {
      // First, delete the image from Supabase Storage if it exists
      if (spotlight.photoUrl) {
        const imageDeleted = await deleteImageFromStorage(spotlight.photoUrl);
        if (!imageDeleted) {
          throw new Error("Failed to delete image from storage.");
        }
      }

      // Then, delete the spotlight record from the database
      await api.spotlight.delete(spotlight.id);
      toast.success("Spotlight entry deleted successfully!");
      setSpotlights((prev) => prev.filter((item) => item.id !== spotlight.id));
    } catch (error) {
      console.error("Failed to delete spotlight entry:", error);
      toast.error("Failed to delete spotlight entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Spotlight Management</h2>
          <p className="text-muted-foreground mt-1">Manage student achievements and success stories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-brand-100 bg-brand-50/30 text-brand-700 text-sm font-semibold">
            {spotlights.length} Total
          </Badge>
          <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold rounded-xl shadow-md">
            <Link to="/admin/spotlight/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Spotlight
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchSpotlights} className="mt-4 rounded-xl border-brand-100">Try Again</Button>
          </div>
        ) : spotlights.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <Star className="h-7 w-7 text-brand-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No spotlight entries listed yet</h3>
            <p className="text-muted-foreground">Highlight outstanding student achievements here.</p>
            <Button asChild className="mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-xl">
              <Link to="/admin/spotlight/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Spotlight
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {spotlights.map((spotlight) => (
              <div 
                key={spotlight.id} 
                className={cn(
                  "group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                  "bg-white/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-lg shadow-sm"
                )}
              >
                <div className="flex items-start space-x-5 flex-1 min-w-0">
                  <Avatar className="h-14 w-14 flex-shrink-0 ring-2 ring-brand-50 group-hover:ring-brand-100 transition-all">
                    <AvatarImage src={spotlight.photoUrl || "/placeholder.svg"} alt={spotlight.name} className="object-cover" />
                    <AvatarFallback className="bg-brand-100 text-brand-700">
                      <Star className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                      {spotlight.name}
                    </h3>
                    <p className="text-sm font-medium text-brand-500 truncate">{spotlight.achievement}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {spotlight.descriptionMd.split('\n')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                  {spotlight.link && (
                    <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-brand-500 hover:bg-brand-50 hover:text-brand-600 rounded-xl">
                      <a href={spotlight.link} target="_blank" rel="noopener noreferrer" aria-label="View Link">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="h-10 px-4 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl shadow-sm">
                    <Link to={`/admin/spotlight/edit/${spotlight.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={deletingId === spotlight.id}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl"
                      >
                        {deletingId === spotlight.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-brand-800">Delete spotlight entry?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          This will permanently delete the spotlight entry for
                          <span className="font-semibold text-brand-700"> "{spotlight.name}"</span> and its associated image from storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl border-brand-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(spotlight)} 
                          className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
                        >
                          Delete
                        </AlertDialogAction>
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

export default SpotlightManagement;