"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Loader2, 
  User, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  Layers, 
  RefreshCw, 
  History, 
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { sortExecutivesByHierarchy } from "@/lib/hierarchy";
import { Executive, PastExecutive } from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const councilTypes: Executive['councilType'][] = ['Central', 'Senate', 'Judiciary'];

const ExecutivesManagement: React.FC = () => {
  // Active Executives State
  const [allExecutives, setAllExecutives] = useState<Executive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [councilFilter, setCouncilFilter] = useState<Executive['councilType'] | 'All'>('All');

  // Past Executives Archive State
  const [pastExecutives, setPastExecutives] = useState<PastExecutive[]>([]);
  const [filteredPastExecutives, setFilteredPastExecutives] = useState<PastExecutive[]>([]);
  const [pastSessions, setPastSessions] = useState<string[]>([]);
  const [pastCouncilFilter, setPastCouncilFilter] = useState<Executive['councilType'] | 'All'>('All');
  const [pastSessionFilter, setPastSessionFilter] = useState<string>('All');
  const [loadingPast, setLoadingPast] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  // Power Transition Dialog State
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [transitionSession, setTransitionSession] = useState<string>("2024/2025");
  const [transitionScope, setTransitionScope] = useState<Executive['councilType'] | 'All'>("All");
  const [transitioning, setTransitioning] = useState(false);

  const fetchExecutives = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.executives.getAll();
      setAllExecutives(data);
    } catch (err) {
      console.error("Failed to fetch active executives:", err);
      setError("Failed to load active executive profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPastExecutives = async () => {
    setLoadingPast(true);
    try {
      const [pastData, sessionsData] = await Promise.all([
        api.executives.getPast(),
        api.executives.getPastSessions(),
      ]);
      setPastExecutives(pastData);
      setPastSessions(sessionsData);
    } catch (err) {
      console.error("Failed to fetch past executives:", err);
    } finally {
      setLoadingPast(false);
    }
  };

  useEffect(() => {
    fetchExecutives();
    fetchPastExecutives();
  }, []);

  useEffect(() => {
    let currentExecutives = [...allExecutives];
    if (councilFilter !== 'All') {
      currentExecutives = currentExecutives.filter(e => e.councilType === councilFilter);
    }
    setFilteredExecutives(sortExecutivesByHierarchy(currentExecutives));
  }, [councilFilter, allExecutives]);

  useEffect(() => {
    let currentPast = [...pastExecutives];
    if (pastCouncilFilter !== 'All') {
      currentPast = currentPast.filter(e => e.councilType === pastCouncilFilter);
    }
    if (pastSessionFilter !== 'All') {
      currentPast = currentPast.filter(e => e.academicSession === pastSessionFilter);
    }
    setFilteredPastExecutives(sortExecutivesByHierarchy(currentPast));
  }, [pastCouncilFilter, pastSessionFilter, pastExecutives]);

  const handleReorder = async (executive: Executive, direction: 'up' | 'down') => {
    const currentIndex = filteredExecutives.findIndex(e => e.id === executive.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredExecutives.length) return;

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

  const handleDeleteActive = async (id: string) => {
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

  const handleDeletePast = async (id: string) => {
    setDeletingId(id);
    try {
      await api.executives.deletePast(id);
      toast.success("Past executive record deleted!");
      setPastExecutives(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error("Failed to delete past executive record:", error);
      toast.error("Failed to delete past executive record.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestorePast = async (id: string) => {
    setRestoringId(id);
    try {
      await api.executives.restorePastToActive(id);
      toast.success("Past executive restored to active roster!");
      await Promise.all([fetchExecutives(), fetchPastExecutives()]);
    } catch (error) {
      console.error("Failed to restore past executive:", error);
      toast.error("Failed to restore past executive.");
    } finally {
      setRestoringId(null);
    }
  };

  const handleExecutePowerTransition = async () => {
    if (!transitionSession.trim()) {
      toast.error("Please enter a valid tenure/academic session (e.g. 2024/2025).");
      return;
    }

    setTransitioning(true);
    try {
      const res = await api.executives.initiatePowerTransition({
        academicSession: transitionSession.trim(),
        councilType: transitionScope,
      });

      if (res.count === 0) {
        toast.info("No active executives found for the selected scope.");
      } else {
        toast.success(`Power transition complete! Archived ${res.count} executive(s) under session ${transitionSession}.`);
        setTransitionModalOpen(false);
        await Promise.all([fetchExecutives(), fetchPastExecutives()]);
      }
    } catch (err: any) {
      console.error("Power transition failed:", err);
      toast.error(`Power transition failed: ${err.message || 'Please try again.'}`);
    } finally {
      setTransitioning(false);
    }
  };

  const activeCountForScope = transitionScope === 'All'
    ? allExecutives.length
    : allExecutives.filter(e => e.councilType === transitionScope).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            Executive Council
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">({allExecutives.length})</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Union leadership &amp; power transitions</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setTransitionModalOpen(true)}
            variant="outline"
            className="border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md h-9 px-3 text-sm whitespace-nowrap"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Transition
          </Button>
          <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap">
            <Link to="/executives/add">
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Executive
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-md mb-5 h-9">
          <TabsTrigger value="active" className="rounded text-xs font-medium px-4 h-7">
            Active ({allExecutives.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded text-xs font-medium px-4 h-7 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" /> Archive ({pastExecutives.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Active Leadership Roster */}
        <TabsContent value="active" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Current Administration Roster</h3>
            <Select value={councilFilter} onValueChange={(val: Executive['councilType'] | 'All') => setCouncilFilter(val)}>
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
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
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
              <p className="text-muted-foreground text-lg">No active executives found for this council.</p>
              <Button variant="link" onClick={() => setCouncilFilter('All')} className="mt-1 text-brand-500">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
              {filteredExecutives.map((executive, index) => (
                <div key={executive.id} className="flex flex-col sm:flex-row sm:items-center">
                  {/* Content */}
                  <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                    <Avatar className="h-11 w-11 shrink-0 rounded-md">
                      <AvatarImage src={executive.photoUrl || ""} alt={executive.name} className="object-cover" />
                      <AvatarFallback className="bg-brand-50 text-brand-400 rounded-md">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                          {executive.councilType}
                        </span>
                        {executive.faculty && (
                          <span className="text-[10px] text-slate-400">{executive.faculty}</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate">{executive.name}</p>
                      <p className="text-xs text-brand-600 font-medium">{executive.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                    {/* Reorder buttons */}
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden mr-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReorder(executive, 'up')}
                        disabled={index === 0 || deletingId !== null}
                        className="h-8 w-8 rounded-none text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-r border-slate-200"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReorder(executive, 'down')}
                        disabled={index === filteredExecutives.length - 1 || deletingId !== null}
                        className="h-8 w-8 rounded-none text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs">
                      <Link to={`/executives/edit/${executive.slug}`}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === executive.id}
                          className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                        >
                          {deletingId === executive.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete</>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base">Delete profile?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            This will permanently remove "{executive.name}" from the active executive council roster.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteActive(executive.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
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
        </TabsContent>

        {/* Tab 2: Past Executives Archive */}
        <TabsContent value="past" className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-sm text-slate-500">Alumni leadership archive by session</p>
            <div className="flex gap-2">
              <Select value={pastSessionFilter} onValueChange={setPastSessionFilter}>
                <SelectTrigger className="h-9 w-[140px] bg-white border-slate-200 rounded-md text-sm">
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="All">All Sessions</SelectItem>
                  {pastSessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pastCouncilFilter} onValueChange={(val: Executive['councilType'] | 'All') => setPastCouncilFilter(val)}>
                <SelectTrigger className="h-9 w-[140px] bg-white border-slate-200 rounded-md text-sm">
                  <SelectValue placeholder="All Councils" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="All">All Councils</SelectItem>
                  {councilTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingPast ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ) : filteredPastExecutives.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <History className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">No archived executives</p>
                <p className="text-xs text-slate-400 mt-0.5">Use the Power Transition button to archive active leaders at tenure end.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
              {filteredPastExecutives.map(exec => (
                <div key={exec.id} className="flex flex-col sm:flex-row sm:items-center">
                  {/* Content */}
                  <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0 rounded-md">
                      <AvatarImage src={exec.photoUrl || ""} alt={exec.name} className="object-cover" />
                      <AvatarFallback className="bg-slate-100 text-slate-400 rounded-md">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {exec.academicSession}
                        </span>
                        <span className="text-[10px] text-slate-400">{exec.councilType}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate">{exec.name}</p>
                      <p className="text-xs text-brand-600">{exec.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestorePast(exec.id)}
                      disabled={restoringId === exec.id}
                      className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-xs"
                    >
                      {restoringId === exec.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-brand-500" />
                      )}
                      Restore
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === exec.id}
                          className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base">Delete archived record?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            This will permanently remove {exec.name} ({exec.academicSession}) from past executive history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePast(exec.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
                          >
                            Delete Record
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Power Transition Dialog */}
      <Dialog open={transitionModalOpen} onOpenChange={setTransitionModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-lg p-6 border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <RefreshCw className="h-4 w-4 text-amber-600" />
              Power Transition
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Archives current active leadership into the Past Executives record.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                This will archive <strong>{activeCountForScope} active executive(s)</strong> for the selected scope.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Academic Session / Tenure Year
              </Label>
              <Input
                value={transitionSession}
                onChange={e => setTransitionSession(e.target.value)}
                placeholder="e.g. 2024/2025"
                className="rounded-md border-slate-200 h-9 text-sm"
              />
              <p className="text-[11px] text-slate-400">
                This label will be attached to all archived profiles.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Council Scope
              </Label>
              <Select
                value={transitionScope}
                onValueChange={(val: Executive['councilType'] | 'All') => setTransitionScope(val)}
              >
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-md h-9 text-sm">
                  <SelectValue placeholder="Select Scope" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="All">All Councils</SelectItem>
                  {councilTypes.map(type => (
                    <SelectItem key={type} value={type}>{type} Council Only</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setTransitionModalOpen(false)}
              disabled={transitioning}
              className="rounded-md border-slate-200 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExecutePowerTransition}
              disabled={transitioning || activeCountForScope === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-md h-9 text-sm px-5"
            >
              {transitioning ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Transitioning...</>
              ) : (
                "Confirm & Execute"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutivesManagement;
