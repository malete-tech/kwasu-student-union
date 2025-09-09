"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

const ExecutiveProfilesSection: React.FC = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await api.executives.getAll();
        setExecutives(data.slice(0, 4)); // Limit to 4 for the homepage section
      } catch (err) {
        console.error("Failed to fetch executives:", err);
        setError("Failed to load executive profiles.");
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  return (
    <Card className="shadow-lg rounded-2xl p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-brand-700">Executive Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500 text-brand-800 italic">
          <Quote className="absolute top-2 left-2 h-6 w-6 text-brand-300 opacity-50" />
          <p className="ml-8 text-sm">
            "The Students' Union is committed to fostering a supportive and dynamic environment where every student can achieve their full potential."
          </p>
          <Quote className="absolute bottom-2 right-2 h-6 w-6 text-brand-300 opacity-50 rotate-180" />
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <Skeleton className="h-16 w-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-sm text-center">{error}</div>
        ) : executives.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {executives.map((executive) => (
              <ExecutiveCard key={executive.id} executive={executive} className="p-4 shadow-none border-none" />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center">No executives to display.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveProfilesSection;