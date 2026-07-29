"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ExecutiveCouncilHeader } from "@/components/ExecutiveCouncilHeader";
import FadeIn from "@/components/FadeIn";

const JudiciaryCouncil = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await api.executives.getAll("Judiciary");
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
        <meta
          name="description"
          content="Meet the justices and members of the KWASU Students' Union Judiciary Council."
        />
        <link rel="canonical" href="https://thekwasusu.com/executives/judiciary" />
      </Helmet>

      <ExecutiveCouncilHeader
        title="Judiciary Council"
        subtitle="The judicial branch of the KWASU Students' Union upholding constitutional compliance, rights, and dispute resolution."
        activeCouncil="Judiciary"
      />

      <div className="container py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded overflow-hidden p-3 space-y-3 bg-white">
                <Skeleton className="aspect-[3/4] w-full rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm font-medium text-red-500 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : executives.length > 0 ? (
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {executives.map((executive) => (
                <ExecutiveCard key={executive.id} executive={executive} />
              ))}
            </div>
          </FadeIn>
        ) : (
          <div className="py-20 flex flex-col items-center text-center">
            <i className="fa-solid fa-users-slash text-4xl text-gray-200 mb-4" />
            <p className="text-sm font-semibold text-gray-500 mb-1">
              No Judiciary Council profiles available yet
            </p>
            <p className="text-xs text-gray-400">
              Judiciary directory entries will appear here once updated.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default JudiciaryCouncil;