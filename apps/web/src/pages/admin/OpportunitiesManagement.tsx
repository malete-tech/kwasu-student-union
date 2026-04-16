"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Briefcase, CalendarDays, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
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
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OpportunitiesManagement: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.opportunities.getAll();
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("Failed to load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await api.opportunities.delete(id);
      toast.success(`Opportunity "${title}" deleted successfully!`);
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      toast.error("Failed to delete opportunity. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Student Opportunities</h2>
          <p className="text-muted-foreground mt-1">
            Curate internships, scholarships, and career growth pathways for the student body.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Badge variant="outline" className="hidden xs:flex h-10 px-4 rounded-xl border-brand-100 bg-brand-50/30 text-brand-700 text-sm font-semibold">
            {opportunities.length} Total
          </Badge>
          <Button asChild className="flex-1 sm:flex-none bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-all hover:shadow-lg">
            <Link to="/admin/opportunities/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Opportunity
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-14 w-14 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center px-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchOpportunities} className="mt-4 rounded-xl border-brand-100">Try Again</Button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100 px-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <Sparkles className="h-7 w-7 text-brand-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No opportunities listed yet</h3>
            <p className="text-muted-foreground">Start by posting internships, scholarships, or workshop opportunities.</p>
            <Button asChild className="mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-xl">
              <Link to="/admin/opportunities/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Opportunity
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {opportunities.map((opportunity) => {
              const deadlineDate = new Date(opportunity.deadline);
              const isClosed = isPast(deadlineDate);
              
              return (
                <div 
                  key={opportunity.id} 
                  className={cn(
                    "group relative flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-2xl border transition-all duration-300 gap-4",
                    isClosed 
                      ? "bg-slate-50/50 border-slate-100 opacity-75 grayscale-[0.5]" 
                      : "bg-white/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-lg shadow-sm"
                  )}
                >
                  <div className="flex items-start sm:items-center space-x-4 sm:space-x-5 flex-1 min-w-0">
                    <div className={cn(
                      "p-3 rounded-xl sm:rounded-2xl flex-shrink-0 transition-colors duration-300",
                      isClosed 
                        ? "bg-slate-200 text-slate-500" 
                        : "bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white"
                    )}>
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                          {opportunity.title}
                        </h3>
                        {isClosed && (
                          <Badge variant="outline" className="text-[9px] sm:text-[10px] uppercase font-bold tracking-tighter border-slate-200 bg-slate-100 text-slate-500">
                            Closed
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 sm:gap-x-4 text-xs sm:text-sm">
                        <div className="flex items-center text-slate-500 font-medium">
                          <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-brand-400" />
                          {isClosed ? 'Expired on' : 'Deadline:'} {format(deadlineDate, "MMM dd, yyyy")}
                        </div>
                        {opportunity.sponsor && (
                          <div className="flex items-center text-slate-400 italic">
                            <span className="mr-1.5 hidden sm:inline">•</span>
                            Sponsor: {opportunity.sponsor}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-none border-slate-100/50">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 text-brand-500 hover:bg-brand-50 hover:text-brand-600 rounded-xl">
                      <a href={opportunity.link} target="_blank" rel="noopener noreferrer" aria-label="View Link">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    
                    <Button asChild variant="outline" className="h-9 sm:h-10 px-3 sm:px-4 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl shadow-sm text-xs sm:text-sm">
                      <Link to={`/admin/opportunities/edit/${opportunity.id}`}>
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Edit
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={deletingId === opportunity.id}
                          className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl"
                        >
                          {deletingId === opportunity.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-none shadow-2xl mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-brand-800">Delete opportunity?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm sm:text-base">
                            This will permanently remove <span className="font-semibold text-brand-700">"{opportunity.title}"</span> from the student dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="rounded-xl border-brand-100 w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(opportunity.id, opportunity.title)} 
                            className="bg-destructive hover:bg-destructive/90 text-white rounded-xl w-full sm:w-auto"
                          >
                            Delete Opportunity
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesManagement;