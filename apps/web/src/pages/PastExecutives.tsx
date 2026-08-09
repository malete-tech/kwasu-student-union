"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { PastExecutive, Executive } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Layers } from "@/components/ui/font-awesome-icon";
import { ExecutiveCouncilHeader } from "@/components/ExecutiveCouncilHeader";
import FadeIn from "@/components/FadeIn";
import { cn } from "@/lib/utils";

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
      filtered = filtered.filter((e) => e.councilType === selectedCouncil);
    }

    if (selectedSession !== "All") {
      filtered = filtered.filter((e) => e.academicSession === selectedSession);
    }

    setFilteredExecutives(filtered);
  }, [selectedCouncil, selectedSession, pastExecutives]);

  const isFiltering = selectedCouncil !== "All" || selectedSession !== "All";

  return (
    <>
      <SEO
        title="Hall of Fame & Past Leadership | KWASU SU"
        description="Explore the presidential legacy and past student union leaders who shaped Kwara State University Students' Union over the years."
        url="https://kwasusu.com.ng/executives/past"
      />

      <ExecutiveCouncilHeader
        title="Hall of Fame & Past Leadership"
        subtitle="Honoring the past leaders who paved the way for student governance, advocacy, and excellence at Kwara State University."
        activeCouncil="Past"
      />

      <div className="container max-w-6xl mx-auto py-10 px-4">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
          {/* Council Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {councilCategories.map((cat) => {
              const isActive = selectedCouncil === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCouncil(cat.value)}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap border shrink-0",
                    isActive
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-900"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Academic Session Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Tenure Session:
            </span>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[160px] h-9 bg-white border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-brand-700 rounded">
                <Calendar className="h-3.5 w-3.5 mr-2 text-brand-700" />
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent className="rounded">
                <SelectItem value="All" className="text-xs">All Sessions</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session} value={session} className="text-xs">
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isFiltering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCouncil("All");
                  setSelectedSession("All");
                }}
                className="h-9 px-2 text-xs text-gray-500 hover:text-gray-900 font-semibold"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Executive profiles grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-4 space-y-3">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
                <Skeleton className="h-8 w-full rounded mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <div className="w-10 h-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-gray-800 mb-1">No Past Executives Found</h3>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto mb-4">
              There are no archived records matching your selected council or tenure session filters.
            </p>
            {isFiltering && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCouncil("All");
                  setSelectedSession("All");
                }}
                className="h-8 text-xs font-bold rounded border-gray-200"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredExecutives.map((exec) => (
                <div
                  key={exec.id}
                  className="group relative flex flex-col justify-between bg-white border border-gray-100 hover:border-gray-300 rounded p-4 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <Avatar className="h-20 w-20 border border-gray-100 group-hover:border-brand-700 transition-colors">
                        <AvatarImage src={exec.photoUrl || ""} alt={exec.name} className="object-cover" />
                        <AvatarFallback className="bg-brand-50 text-brand-700 font-bold text-xs">
                          <User className="h-7 w-7" />
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-brand-900 bg-brand-50 border border-brand-100 uppercase tracking-wider mb-2">
                      {exec.academicSession}
                    </span>

                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-900 transition-colors line-clamp-1">
                      {exec.name}
                    </h3>
                    <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mt-0.5">
                      {exec.role}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500">
                      <span>{exec.councilType} Council</span>
                      {exec.faculty && (
                        <span className="truncate max-w-[110px]">
                          • {exec.faculty}
                        </span>
                      )}
                    </div>
                  </div>

                  {exec.projectsMd && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 line-clamp-2 leading-relaxed text-center">
                      {exec.projectsMd.replace(/[#*`]/g, "")}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-gray-400">Archived Record</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 group-hover:text-brand-900 transition-colors">
                      View Profile
                      <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </span>
                  </div>

                  {/* Full Card Router Link Overlay */}
                  <Link
                    to={`/executives/${exec.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View full profile of past leader ${exec.name}`}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
};

export default PastExecutives;

