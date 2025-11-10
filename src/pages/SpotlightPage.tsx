"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Spotlight } from "@/types";
import SpotlightCard from "@/components/SpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const SpotlightPage: React.FC = () => {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        const data = await api.spotlight.getAll();
        setSpotlights(data);
      } catch (err) {
        console.error("Failed to fetch spotlights:", err);
        setError("Failed to load spotlight entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlights();
  }, []);

  return (
    <>
      <Helmet>
        <title>Spotlight | KWASU Students' Union</title>
        <meta name="description" content="View all past and present student spotlight features highlighting achievements and success stories." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700 flex items-center justify-center">
          <Star className="h-8 w-8 mr-3 text-brand-gold" /> Spotlight Archive
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-lg rounded-xl">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg">{error}</div>
        ) : spotlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlights.map((spotlight) => (
              <SpotlightCard key={spotlight.id} spotlight={spotlight} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No spotlight entries found yet.</p>
        )}
      </div>
    </>
  );
};

export default SpotlightPage;