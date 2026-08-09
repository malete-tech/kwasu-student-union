"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Spotlight } from "@/types";
import SpotlightCard from "@/components/SpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import FadeIn from "@/components/FadeIn";

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
      <SEO
        title="Student Spotlight | KWASU SU"
        description="Celebrating exceptional Kwara State University student achievers, innovators, and leaders making an impact."
        url="https://kwasusu.com.ng/spotlight"
      />

      {/* Page Banner */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

        <div className="container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-bold text-brand-300 hover:text-white mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px] mr-2" aria-hidden="true" />
              Back to Home
            </Link>
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Excellence & Leadership
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Student{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Spotlight
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Celebrating the exceptional achievements, innovations, and leadership of Kwara State University students.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto py-10 px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded overflow-hidden bg-white space-y-3">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : spotlights.length > 0 ? (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spotlights.map((spotlight) => (
                <SpotlightCard key={spotlight.id} spotlight={spotlight} />
              ))}
            </div>
          </FadeIn>
        ) : (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <i className="fa-solid fa-star text-2xl text-gray-300 mb-2 block" />
            <p className="text-xs font-semibold text-gray-600 mb-1">No spotlight features yet</p>
            <p className="text-[11px] text-gray-400">
              Student achievement features will appear here as they are published.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SpotlightPage;