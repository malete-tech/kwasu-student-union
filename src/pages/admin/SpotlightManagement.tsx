"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Star, ExternalLink } from "lucide-react";
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
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold rounded-xl shadow-md">
          <Link to="/admin/spotlight/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Spotlight
          </Link>
        </Button>
      </div>
      
      <div className="bg-white p-6 shadow-lg rounded-xl space-y-4">
        <h3 className="text-xl font-semibold text-brand-700 pb-4 border-b">Manage Spotlight Entries</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-center text-lg">{error}</div>
        ) : spotlights.length === 0 ? (
          <p className="text-center text-muted-foreground">No spotlight entries found. Start by adding a new one!</p>
        ) : (
          <div className="space-y-4">
            {spotlights.map((spotlight) => (
              <div key={spotlight.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm">
                <div className="flex items-start space-x-4 flex-1 min-w-0 mb-2 sm:mb-0">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={spotlight.photoUrl || "/placeholder.svg"} alt={spotlight.name} />
                    <AvatarFallback className="bg-brand-100 text-brand-700">
                      <Star className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-brand-800 truncate">{spotlight.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{spotlight.achievement}</p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                  {spotlight.link && (
                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <a href={spotlight.link} target="_blank" rel="noopener noreferrer" aria-label="View Link">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Link</span>
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                    <Link to={`/admin/spotlight/edit/${spotlight.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" disabled={deletingId === spotlight.id}>
                        {deletingId === spotlight.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the spotlight entry for
                          "{spotlight.name}" and its associated image from storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(spotlight)} className="bg-destructive hover:bg-destructive/90">
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