"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { History } from "@/components/ui/font-awesome-icon";
import { Button } from "@/components/ui/button";

const SenateCouncil = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        // Fetch only Senate Council members
        const data = await api.executives.getAll('Senate');
        setExecutives(data);
      } catch (err) {
        console.error("Failed to fetch executives:", err);
        setError("Failed to load Senate Council profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  return (
    <>
      <Helmet>
        <title>Senate Council | KWASU Students' Union</title>
        <meta name="description" content="Meet the principal officers of the KWASU Students' Union Senate Council." />
      </Helmet>
      <div className="container py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-700">Senate Council Principal Officers</h1>
            <p className="text-sm text-slate-500 mt-1">Current Senate leadership of the Kwara State University Students' Union.</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-brand-200 text-brand-700 hover:bg-brand-50">
            <Link to="/executives/past">
              <History className="h-4 w-4 mr-2 text-brand-500" /> View Past Executives Archive
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg">{error}</div>
        ) : executives.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {executives.map((executive) => (
              <ExecutiveCard key={executive.id} executive={executive} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No Senate Council profiles available yet.</p>
        )}
      </div>
    </>
  );
};

export default SenateCouncil;