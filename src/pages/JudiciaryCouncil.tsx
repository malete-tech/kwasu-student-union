"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Skeleton } from "@/components/ui/skeleton";

const JudiciaryCouncil = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        // Fetch only Judiciary Council members
        const data = await api.executives.getAll('Judiciary');
        setExecutives(data);
      } catch (err) {
        console.error("Failed to fetch executives:", err);
        setError("Failed to load Judiciary Council profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  return (
    <>
      <Helmet>
        <title>Judiciary Council | KWASU Students' Union</title>
        <meta name="description" content="Meet the members of the KWASU Students' Union Judiciary Council." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Judiciary Council</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          The Judiciary Council is the judicial arm of the Students' Union, responsible for interpreting the constitution and resolving disputes.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <p className="text-center text-muted-foreground">No Judiciary Council profiles available yet.</p>
        )}
      </div>
    </>
  );
};

export default JudiciaryCouncil;