"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { News, Event, Opportunity } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import NewsFeedItem from "@/components/NewsFeedItem";
import EventCard from "@/components/event-card";
import { format, isPast } from "date-fns";
import FadeIn from "@/components/FadeIn";

interface SearchResults {
  news: News[];
  events: Event[];
  opportunities: Opportunity[];
}

const OpportunityResultCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const deadlineDate = new Date(opportunity.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <div className={`border border-gray-100 bg-white rounded p-4 flex flex-col justify-between hover:border-gray-300 transition-colors ${isDeadlinePast ? "opacity-60 bg-gray-50/50" : ""}`}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xs font-bold text-gray-900 leading-snug">
            <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand-900 transition-colors">
              {opportunity.title}
            </a>
          </h3>
          {isDeadlinePast && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-red-600 bg-red-50 border border-red-100 uppercase">
              Closed
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 font-medium mb-3">
          Deadline: {format(deadlineDate, "MMM d, yyyy")}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
        {opportunity.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResults>({ news: [], events: [], opportunities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm) {
      setLoading(false);
      setResults({ news: [], events: [], opportunities: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.search.searchAll(searchTerm);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setError("Failed to perform search. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchTerm]);

  const totalResults = results.news.length + results.events.length + results.opportunities.length;

  return (
    <>
      <SEO
        title={`Search Results for "${searchTerm}" | KWASU SU`}
        description={`Search results for ${searchTerm} across news articles, events, and student opportunities.`}
        url={`https://kwasusu.com.ng/search?q=${encodeURIComponent(searchTerm)}`}
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
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              KWASU SU Global Search
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Search{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Results
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              {loading ? "Searching repository..." : `Found ${totalResults} result${totalResults === 1 ? "" : "s"} for `}
              {searchTerm && <span className="font-semibold text-white">"{searchTerm}"</span>}
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto py-10 px-4">
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-40 w-full rounded" />
              <Skeleton className="h-40 w-full rounded" />
              <Skeleton className="h-40 w-full rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : totalResults === 0 ? (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <i className="fa-solid fa-magnifying-glass text-2xl text-gray-300 mb-2 block" />
            <p className="text-xs font-semibold text-gray-600 mb-1">No matches found</p>
            <p className="text-[11px] text-gray-400 mb-4">
              We couldn't find any content matching "{searchTerm}".
            </p>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 transition-colors"
            >
              Browse News
              <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <FadeIn>
            <div className="space-y-10">
              {/* News Results */}
              {results.news.length > 0 && (
                <section>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <i className="fa-solid fa-newspaper text-brand-700" aria-hidden="true" />
                      News Articles ({results.news.length})
                    </h2>
                    <Link to="/news" className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors">
                      View All News &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.news.map((item) => (
                      <NewsFeedItem key={item.id} news={item} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              {/* Events Results */}
              {results.events.length > 0 && (
                <section>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <i className="fa-solid fa-calendar-days text-brand-700" aria-hidden="true" />
                      Upcoming Events ({results.events.length})
                    </h2>
                    <Link to="/events" className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors">
                      View All Events &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.events.map((item) => (
                      <EventCard key={item.id} event={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Opportunities Results */}
              {results.opportunities.length > 0 && (
                <section>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <i className="fa-solid fa-briefcase text-brand-700" aria-hidden="true" />
                      Opportunities ({results.opportunities.length})
                    </h2>
                    <Link to="/services/opportunities" className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors">
                      View All Opportunities &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.opportunities.map((item) => (
                      <OpportunityResultCard key={item.id} opportunity={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;