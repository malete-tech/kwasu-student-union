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
      <Helmet>
        <title>Past Executives Archive | KWASU Students' Union</title>
        <meta
          name="description"
          content="Historical directory of past student leaders, Central Executive, Senate Council, and Judiciary Council members of KWASU SU."
        />
        <link rel="canonical" href="https://thekwasusu.com/executives/past" />
      </Helmet>

      <ExecutiveCouncilHeader
        title="Hall of Fame & Past Leadership"
        subtitle="Honoring the past leaders who paved the way for student governance, advocacy, and excellence at Kwara State University."
        activeCouncil="Past"
      />

      <div className="container py-10">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
          {/* Council filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {councilCategories.map((cat) => {
              const isActive = selectedCouncil === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCouncil(cat.value)}
                  className={cn(
                    "h-7 px-3 rounded text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-700"
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
              <SelectTrigger className="w-[170px] h-8 bg-white border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-brand-500">
                <Calendar className="h-3.5 w-3.5 mr-2 text-brand-500" />
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
                className="h-8 px-2 text-xs text-gray-400 hover:text-gray-600 font-semibold"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Executive profiles list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded p-4 space-y-3">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm font-medium text-red-500 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">No Past Executives Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              There are no archived records matching your selected council or tenure session.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredExecutives.map((exec) => (
                <div
                  key={exec.id}
                  className="group flex flex-col bg-white border border-gray-100 rounded p-5 transition-all duration-200 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="relative mb-3">
                      <Avatar className="h-20 w-20 border border-gray-100 group-hover:border-brand-300 transition-colors">
                        <AvatarImage src={exec.photoUrl || ""} alt={exec.name} className="object-cover" />
                        <AvatarFallback className="bg-brand-50 text-brand-400">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <Badge variant="outline" className="text-[10px] font-bold text-brand-600 border-brand-200 bg-brand-50/50 mb-2">
                      {exec.academicSession}
                    </Badge>

                    <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {exec.name}
                    </h3>
                    <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mt-0.5">
                      {exec.role}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-medium text-gray-500">
                        {exec.councilType} Council
                      </span>
                      {exec.faculty && (
                        <span className="text-[11px] text-gray-400 truncate max-w-[120px]">
                          • {exec.faculty}
                        </span>
                      )}
                    </div>
                  </div>

                  {exec.projectsMd && (
                    <div className="mt-auto pt-3 border-t border-gray-50 text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {exec.projectsMd.replace(/[#*`]/g, "")}
                    </div>
                  )}
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
