"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import AdPlacement from "@/components/AdPlacement";
import FadeIn from "@/components/FadeIn";

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const deadlineDate = new Date(opportunity.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <div
      className={cn(
        "group border rounded p-4 transition-colors flex flex-col justify-between h-full bg-white",
        isDeadlinePast
          ? "border-gray-100 opacity-60 bg-gray-50/50"
          : "border-gray-100 hover:border-gray-300"
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-8 h-8 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-briefcase text-xs" aria-hidden="true" />
          </div>
          {isDeadlinePast && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 uppercase">
              Closed
            </span>
          )}
        </div>

        <h3 className="text-xs font-bold text-gray-900 leading-snug mb-1 group-hover:text-brand-900 transition-colors">
          {opportunity.title}
        </h3>

        {opportunity.sponsor && (
          <p className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-2">
            Sponsor: {opportunity.sponsor}
          </p>
        )}

        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {opportunity.descriptionMd}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100 mt-auto space-y-3">
        <div className="flex items-center text-[11px] text-gray-500 font-medium">
          <i className="fa-solid fa-calendar-day mr-1.5 text-gray-400" aria-hidden="true" />
          <span>Deadline: {format(deadlineDate, "MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {opportunity.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors",
              isDeadlinePast
                ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                : "bg-brand-900 hover:bg-brand-800 text-white"
            )}
          >
            Apply
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesPage: React.FC = () => {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await api.opportunities.getAll();
        setAllOpportunities(data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
        setFilteredOpportunities(data);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
        setError("Failed to load opportunities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  useEffect(() => {
    let currentOpportunities = allOpportunities;

    if (activeTag) {
      currentOpportunities = currentOpportunities.filter(opp => opp.tags.includes(activeTag));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentOpportunities = currentOpportunities.filter(opp =>
        opp.title.toLowerCase().includes(lowerSearch) ||
        opp.descriptionMd.toLowerCase().includes(lowerSearch) ||
        (opp.sponsor && opp.sponsor.toLowerCase().includes(lowerSearch)) ||
        opp.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredOpportunities(currentOpportunities);
  }, [searchTerm, activeTag, allOpportunities]);

  const uniqueTags = Array.from(new Set(allOpportunities.flatMap(opp => opp.tags)));

  return (
    <>
      <SEO
        title="Opportunities & Scholarships | KWASU SU"
        description="Explore verified scholarships, internships, fellowships, and career development opportunities for KWASU students."
        url="https://kwasusu.com.ng/services/opportunities"
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
              to="/services"
              className="inline-flex items-center text-xs font-bold text-brand-300 hover:text-white mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px] mr-2" aria-hidden="true" />
              Back to Services
            </Link>
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Career & Professional Growth
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
                Opportunities
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Explore verified scholarships, internships, fellowships, and professional development programs curated for KWASU students.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto py-10 px-4">
        {/* Search & Category Filter Section */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <Input
              placeholder="Search opportunities by title, sponsor, or keyword..."
              className="h-10 pl-10 pr-4 text-xs bg-white border-gray-200 focus-visible:ring-brand-700 rounded shadow-2xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors border",
                activeTag === null
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              All Types ({allOpportunities.length})
            </button>

            {uniqueTags.map((tag) => {
              const count = allOpportunities.filter(opp => opp.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors border",
                    activeTag === tag
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Ad Placement */}
        <div className="mb-8">
          <AdPlacement placement="opportunities_feed" />
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded p-4 space-y-3 bg-white">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </FadeIn>
        ) : (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <i className="fa-solid fa-briefcase text-2xl text-gray-300 mb-2 block" />
            <p className="text-xs font-semibold text-gray-600 mb-1">No opportunities found</p>
            <p className="text-[11px] text-gray-400">
              No matching listings were found for your current filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default OpportunitiesPage;