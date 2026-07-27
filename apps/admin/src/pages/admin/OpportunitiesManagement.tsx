"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Briefcase,
  CalendarDays,
  ExternalLink,
  Inbox,
} from "@/components/ui/font-awesome-icon";
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            Opportunities
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({opportunities.length})
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Career &amp; academic pathways</p>
        </div>
        <Button
          asChild
          className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap shrink-0"
        >
          <Link to="/opportunities/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Opportunity
          </Link>
        </Button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[78px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-slate-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button
              variant="outline"
              onClick={fetchOpportunities}
              className="mt-3 rounded-md h-8 text-sm"
            >
              Try Again
            </Button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No opportunities listed yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Post internships, scholarships, or workshops
              </p>
            </div>
            <Button
              asChild
              className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-8 px-4 text-sm mt-1"
            >
              <Link to="/opportunities/add">
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Add Opportunity
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {opportunities.map((opportunity) => {
              const deadlineDate = new Date(opportunity.deadline);
              const isClosed = isPast(deadlineDate);

              return (
                <div
                  key={opportunity.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center",
                    isClosed && "opacity-60"
                  )}
                >
                  {/* Content */}
                  <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-10 h-10 shrink-0 rounded-md flex items-center justify-center mt-0.5",
                        isClosed ? "bg-slate-100" : "bg-brand-50"
                      )}
                    >
                      <Briefcase
                        className={cn(
                          "w-4 h-4",
                          isClosed ? "text-slate-400" : "text-brand-600"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {opportunity.type && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                            {opportunity.type}
                          </span>
                        )}
                        {isClosed ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 px-1.5 py-0 border-slate-200 bg-slate-100 text-slate-500"
                          >
                            Closed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 px-1.5 py-0 border-green-200 bg-green-50 text-green-700"
                          >
                            Open
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {opportunity.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <CalendarDays className="w-3 h-3" />
                          {isClosed ? "Expired" : "Deadline:"}{" "}
                          {format(deadlineDate, "MMM d, yyyy")}
                        </span>
                        {opportunity.sponsor && (
                          <span className="text-[11px] text-slate-400 truncate">
                            · {opportunity.sponsor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions — full-width strip on mobile, inline on desktop */}
                  <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                    {/* External link */}
                    {opportunity.link && (
                      <a
                        href={opportunity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors shrink-0"
                        aria-label="View external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs"
                    >
                      <Link to={`/opportunities/edit/${opportunity.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === opportunity.id}
                          className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                        >
                          {deletingId === opportunity.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base">
                            Delete opportunity?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            This will permanently remove "{opportunity.title}" from the student dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="rounded-md mt-0 h-9">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(opportunity.id, opportunity.title)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
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
