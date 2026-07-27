"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { PastExecutive, Executive } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, History, Calendar, Layers } from "@/components/ui/font-awesome-icon";
import { Link } from "react-router-dom";

const councilCategories: { label: string; value: Executive['councilType'] | 'All' }[] = [
  { label: "All Councils", value: "All" },
  { label: "Central Executive", value: "Central" },
  { label: "Senate Council", value: "Senate" },
  { label: "Judiciary Council", value: "Judiciary" },
];

const PastExecutives: React.FC = () => {
  const [pastExecutives, setPastExecutives] = useState<PastExecutive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<PastExecutive[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("All");
  const [selectedCouncil, setSelectedCouncil] = useState<Executive['councilType'] | "All">("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [execsData, sessionsData] = await Promise.all([
          api.executives.getPast(),
          api.executives.getPastSessions(),
        ]);
        setPastExecutives(execsData);
        setSessions(sessionsData);
      } catch (err) {
        console.error("Failed to fetch past executives:", err);
        setError("Unable to load past executive profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...pastExecutives];

    if (selectedCouncil !== "All") {
      filtered = filtered.filter(e => e.councilType === selectedCouncil);
    }

    if (selectedSession !== "All") {
      filtered = filtered.filter(e => e.academicSession === selectedSession);
    }

    setFilteredExecutives(filtered);
  }, [selectedCouncil, selectedSession, pastExecutives]);

  return (
    <>
      <Helmet>
        <title>Past Executives & Alumni Leadership | KWASU Students' Union</title>
        <meta 
          name="description" 
          content="Explore the historical directory of past student leaders, Central Executive, Senate Council, and Judiciary Council members of KWASU SU." 
        />
        <link rel="canonical" href="https://thekwasusu.com/executives/past" />
      </Helmet>

      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent"></div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <History className="h-4 w-4 text-brand-gold" />
            Union Hall of Fame & Legacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Past Executives & Leadership
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-light">
            Honoring the past leaders who paved the way for student governance, advocacy, and excellence at Kwara State University.
          </p>
        </div>
      </div>

      <div className="container py-12 px-4 max-w-7xl mx-auto space-y-8">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {councilCategories.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCouncil === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCouncil(cat.value)}
                className={
                  selectedCouncil === cat.value
                    ? "bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md font-semibold"
                    : "rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Academic Session Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tenure Session:</span>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl focus:ring-brand-gold shadow-sm">
                <Calendar className="h-4 w-4 mr-2 text-brand-500" />
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All Sessions</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Executive profiles list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <Skeleton className="h-28 w-28 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50/50 rounded-3xl border border-red-100 p-8">
            <p className="text-destructive font-medium text-lg">{error}</p>
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-8">
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Past Executives Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              There are currently no archived past executive records matching your selected council or academic session.
            </p>
            {(selectedCouncil !== "All" || selectedSession !== "All") && (
              <Button 
                variant="outline" 
                onClick={() => { setSelectedCouncil("All"); setSelectedSession("All"); }}
                className="rounded-xl border-slate-300"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExecutives.map(exec => (
              <div 
                key={exec.id} 
                className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-5 flex justify-center">
                    <Avatar className="h-28 w-28 ring-4 ring-slate-50 group-hover:ring-brand-100 transition-all shadow-md">
                      <AvatarImage src={exec.photoUrl || ""} alt={exec.name} className="object-cover" />
                      <AvatarFallback className="bg-brand-50 text-brand-400">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 bg-brand-900 text-brand-gold border border-brand- gold/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow">
                      {exec.academicSession}
                    </Badge>
                  </div>

                  <div className="text-center space-y-1 mt-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {exec.name}
                    </h3>
                    <p className="text-sm font-semibold text-brand-600">{exec.role}</p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {exec.councilType} Council
                      </Badge>
                      {exec.faculty && (
                        <span className="text-[11px] text-slate-400 italic">
                          • {exec.faculty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {exec.projectsMd && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {exec.projectsMd.replace(/[#*`]/g, '')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Link back to current executive councils */}
        <div className="mt-12 text-center pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm mb-4">Looking for current active student union leadership?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" className="rounded-xl border-slate-300">
              <Link to="/executives/central">Central Executive</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-slate-300">
              <Link to="/executives/senate">Senate Council</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-slate-300">
              <Link to="/executives/judiciary">Judiciary Council</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PastExecutives;
