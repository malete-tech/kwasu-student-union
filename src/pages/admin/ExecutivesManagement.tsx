"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, User, ArrowUp, ArrowDown, Filter, Layers } from "lucide-react";
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
    let currentExecutives = [...allExecutives];

    if (councilFilter !== 'All') {
      currentExecutives = currentExecutives.filter(e => e.councilType === councilFilter);
    }

    // Sort by display order
    currentExecutives.sort((a, b) => a.displayOrder - b.displayOrder);

    setFilteredExecutives(currentExecutives);
  }, [councilFilter, allExecutives]);

  const handleReorder = async (executive: Executive, direction: 'up' | 'down') => {
    const currentIndex = filteredExecutives.findIndex(e => e.id === executive.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= filteredExecutives.length) {
      return; 
    }

    const currentExecutive = filteredExecutives[currentIndex]!;
    const targetExecutive = filteredExecutives[targetIndex]!;

    setDeletingId(executive.id); 
    try {
      await api.executives.reorder(currentExecutive.id, targetExecutive.displayOrder);
      await api.executives.reorder(targetExecutive.id, currentExecutive.displayOrder);
      
      toast.success(`Moved ${executive.name} ${direction}.`);
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
      setAllExecutives((prev) => prev.filter((executive) => executive.id !== id));
    } catch (error) {
      console.error("Failed to delete executive profile:", error);
      toast.error("Failed to delete executive profile. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Executive Council</h2>
          <p className="text-muted-foreground mt-1">Manage the leadership and representative bodies of the union.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={councilFilter} onValueChange={(value: Executive['councilType'] | 'All') => setCouncilFilter(value)}>
            <SelectTrigger className="w-[180px] bg-white border-brand-100 rounded-xl focus:ring-brand-gold">
              <Filter className="h-4 w-4 mr-2 text-brand-400" />
              <SelectValue placeholder="Filter Council" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Councils</SelectItem>
              {councilTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md">
            <Link to="/admin/executives/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Executive
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <Skeleton className="h-9 w-9 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchExecutives} className="mt-4 rounded-xl">Try Again</Button>
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-brand-300" />
            </div>
            <p className="text-muted-foreground text-lg">No executives found for this council.</p>
            <Button variant="link" onClick={() => setCouncilFilter('All')} className="mt-1 text-brand-500">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredExecutives.map((executive, index) => (
              <div 
                key={executive.id} 
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/50 hover:bg-white rounded-2xl border border-transparent hover:border-brand-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-brand-50 group-hover:ring-brand-100 transition-all">
                      <AvatarImage src={executive.photoUrl || ""} alt={executive.name} className="object-cover" />
                      <AvatarFallback className="bg-brand-50 text-brand-400">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-brand-50">
                       <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-brand-100 bg-brand-50/50 text-brand-600 uppercase font-bold tracking-tighter">
                        {executive.councilType.charAt(0)}
                       </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {executive.name}
                    </h3>
                    <p className="text-sm font-medium text-brand-500">{executive.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] py-0">
                        {executive.councilType} Council
                      </Badge>
                      {executive.faculty && (
                        <span className="text-[10px] text-muted-foreground italic">
                          • {executive.faculty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <div className="flex bg-slate-100/50 p-1 rounded-xl mr-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleReorder(executive, 'up')}
                      disabled={index === 0 || deletingId !== null}
                      className="h-8 w-8 text-slate-500 hover:text-brand-600 hover:bg-white rounded-lg transition-all"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleReorder(executive, 'down')}
                      disabled={index === filteredExecutives.length - 1 || deletingId !== null}
                      className="h-8 w-8 text-slate-500 hover:text-brand-600 hover:bg-white rounded-lg transition-all"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button asChild variant="outline" size="sm" className="bg-white border-brand-100 text-brand-600 hover:bg-brand-50 rounded-xl px-4 h-9">
                    <Link to={`/admin/executives/edit/${executive.slug}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={deletingId === executive.id}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl h-9 w-9"
                      >
                        {deletingId === executive.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-brand-800">Delete profile?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          This will permanently remove <span className="font-semibold text-brand-700">"{executive.name}"</span> from the executive council directory.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl border-brand-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(executive.id)} 
                          className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
                        >
                          Delete Profile
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

export default ExecutivesManagement;