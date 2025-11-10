"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Briefcase, CalendarDays, ExternalLink } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-700">Opportunities Management</h2>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <Link to="/admin/opportunities/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Opportunity
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage Student Opportunities ({opportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  <Skeleton className="h-12 w-12 rounded-md" />
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
          ) : opportunities.length === 0 ? (
            <p className="text-center text-muted-foreground">No opportunities found. Start by adding a new one!</p>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => {
                const deadlineDate = new Date(opportunity.deadline);
                const isClosed = isPast(deadlineDate);
                return (
                  <div key={opportunity.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm ${isClosed ? 'bg-gray-50 opacity-70' : 'hover:bg-brand-50 transition-colors'}`}>
                    <div className="flex items-start space-x-4 flex-1 min-w-0 mb-2 sm:mb-0">
                      <div className="p-2 rounded-md bg-brand-100 text-brand-700 flex-shrink-0">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-brand-800 truncate">{opportunity.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Deadline: {format(deadlineDate, "PPP")}
                          {isClosed && <Badge variant="destructive" className="ml-2">Closed</Badge>}
                        </p>
                        <p className="text-xs text-gray-500 truncate">Sponsor: {opportunity.sponsor || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                      <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                        <a href={opportunity.link} target="_blank" rel="noopener noreferrer" aria-label="View Link">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Link</span>
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                        <Link to={`/admin/opportunities/edit/${opportunity.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" disabled={deletingId === opportunity.id}>
                            {deletingId === opportunity.id ? (
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
                              This action cannot be undone. This will permanently delete the opportunity
                              "{opportunity.title}" from your database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(opportunity.id, opportunity.title)} className="bg-destructive hover:bg-destructive/90">
                              Delete
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
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunitiesManagement;