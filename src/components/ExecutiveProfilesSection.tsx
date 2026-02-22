"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ExecutiveProfilesSection: React.FC = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        // Fetch only Central Executive members for the homepage preview
        const data = await api.executives.getAll('Central');
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
    <div className="space-y-6">
      <div className="pb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-brand-700">Central Executive Council</h2>
        <Button asChild variant="link" size="sm" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
          <Link to="/executives/central">View All</Link>
        </Button>
      </div>
      <div className="space-y-6">
        <div className="relative p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500 text-brand-800 italic">
          <Quote className="absolute top-2 left-2 h-6 w-6 text-brand-300 opacity-50" />
          <p className="ml-8 text-sm">
            "The Students' Union is committed to fostering a supportive and dynamic environment where every student can achieve their full potential."
          </p>
          <Quote className="absolute bottom-2 right-2 h-6 w-6 text-brand-300 opacity-50 rotate-180" />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-sm text-center">{error}</div>
        ) : executives.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {executives.map((executive) => (
              <ExecutiveCard key={executive.id} executive={executive} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center">No executives to display.</p>
        )}
      </div>
    </div>
  );
};

export default ExecutiveProfilesSection;