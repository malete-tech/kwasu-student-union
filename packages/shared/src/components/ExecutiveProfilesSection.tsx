"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import ExecutiveCard from "@/components/ExecutiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const ExecutiveProfilesSection: React.FC = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const data = await api.executives.getAll("Central");
        setExecutives(data.slice(0, 4));
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
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-0.5">
            Leadership
          </p>
          <h2 className="text-lg font-bold text-gray-900 leading-snug">
            Central Executive Council
          </h2>
        </div>
        <Link
          to="/executives/central"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Full directory <i className="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-gray-100 rounded overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-500 border border-red-100 rounded bg-red-50/50">
          {error}
        </div>
      ) : executives.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {executives.map((executive) => (
            <ExecutiveCard key={executive.id} executive={executive} />
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-xs text-gray-400 border border-gray-100 rounded bg-white">
          <i className="fa-solid fa-users-slash text-3xl text-gray-200 mb-2" />
          <p>No executive profiles available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ExecutiveProfilesSection;