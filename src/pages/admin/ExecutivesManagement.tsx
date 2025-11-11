"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, User, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { Executive } from "@/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const councilTypes: Executive['councilType'][] = ['Central', 'Senate', 'Judiciary'];

const ExecutivesManagement: React.FC = () => {
  const [allExecutives, setAllExecutives] = useState<Executive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [councilFilter, setCouncilFilter] = useState<Executive['councilType'] | 'All'>('All');

  const fetchExecutives = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.executives.getAll();
      setAllExecutives(data);
    } catch (err) {
      console.error("Failed to fetch executives:", err);
      setError("Failed to load executive profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutives();
  }, []);

  useEffect(() => {
    let currentExecutives = allExecutives;

    if (councilFilter !== 'All') {
      currentExecutives = currentExecutives.filter(e => e.councilType === councilFilter);
    }

    // Sort by display order (already handled by API, but re-sort locally for safety)
    currentExecutives.sort((a, b) => a.displayOrder - b.displayOrder);

    setFilteredExecutives(currentExecutives);
  }, [councilFilter, allExecutives]);

  const handleReorder = async (executive: Executive, direction: 'up' | 'down') => {
    const currentIndex = filteredExecutives.findIndex(e => e.id === executive.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= filteredExecutives.length) {
      return; // Cannot move further
    }

    const currentExecutive = filteredExecutives[currentIndex]!;
    const targetExecutive = filteredExecutives[targetIndex]!;

    // Swap display orders in the database
    setDeletingId(executive.id); // Use deletingId temporarily to show loading state on the moving item
    try {
      // Swap the display_order values
      await api.executives.reorder(currentExecutive.id, targetExecutive.displayOrder);
      await api.executives.reorder(targetExecutive.id, currentExecutive.displayOrder);
      
      toast.success(`Moved ${executive.name} ${direction}.`);
      
      // Re-fetch the list to ensure correct sorting based on DB changes
      await fetchExecutives(); 

    } catch (error) {
      console.error(`Failed to move executive ${direction}:`, error);
      toast.error(`Failed to reorder executive. Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.executives.delete(id);
      toast.success("Executive profile deleted successfully!");
      // Update both lists
      setAllExecutives((prev) => prev.filter((executive) => executive.id !== id));
      setFilteredExecutives((prev) => prev.filter((executive) => executive.id !== id));
    } catch (error) {
      console.error("Failed to delete executive profile:", error);
      toast.error("Failed to delete executive profile. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-700">Executives Management</h2>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <Link to="/admin/executives/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Executive
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage Executive Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-end">
            <Select value={councilFilter} onValueChange={(value: Executive['councilType'] | 'All') => setCouncilFilter(value)}>
              <SelectTrigger className="w-[200px] focus-visible:ring-brand-gold">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Council" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Councils</SelectItem>
                {councilTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
          ) : filteredExecutives.length === 0 ? (
            <p className="text-center text-muted-foreground">No executive profiles found matching the filter.</p>
          ) : (
            <div className="space-y-4">
              {filteredExecutives.map((executive, index) => (
                <div key={executive.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={executive.photoUrl || "/placeholder.svg"} alt={executive.name} />
                      <AvatarFallback className="bg-brand-100 text-brand-700">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-brand-800">{executive.name}</h3>
                      <p className="text-sm text-muted-foreground">{executive.role}</p>
                      <Badge variant="secondary" className="mt-1 bg-brand-100 text-brand-700">
                        {executive.councilType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* Reorder Buttons */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleReorder(executive, 'up')}
                      disabled={index === 0 || deletingId !== null}
                      className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold"
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span className="sr-only">Move Up</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleReorder(executive, 'down')}
                      disabled={index === filteredExecutives.length - 1 || deletingId !== null}
                      className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold"
                    >
                      <ArrowDown className="h-4 w-4" />
                      <span className="sr-only">Move Down</span>
                    </Button>

                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <Link to={`/admin/executives/edit/${executive.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={deletingId === executive.id}>
                          {deletingId === executive.id ? (
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
                            This action cannot be undone. This will permanently delete the executive profile for
                            "{executive.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(executive.id)} className="bg-destructive hover:bg-destructive/90">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutivesManagement;