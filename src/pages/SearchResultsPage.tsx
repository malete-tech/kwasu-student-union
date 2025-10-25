"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { News, Event, Opportunity } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Newspaper, CalendarDays, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news-card";
import EventCard from "@/components/event-card";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SearchResults {
  news: News[];
  events: Event[];
  opportunities: Opportunity[];
}

const OpportunityResultCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const deadlineDate = new Date(opportunity.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <Card className={`p-4 shadow-sm border hover:shadow-md transition-shadow ${isDeadlinePast ? "opacity-70" : ""}`}>
      <CardTitle className="text-lg font-semibold leading-tight mb-1">
        <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 focus-visible:ring-brand-gold rounded-md outline-none">
          {opportunity.title}
        </a>
      </CardTitle>
      <p className="text-sm text-muted-foreground mb-2">
        Deadline: {format(deadlineDate, "PPP")}
        {isDeadlinePast && <span className="ml-2 text-destructive font-medium">(Closed)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {opportunity.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
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
      <Helmet>
        <title>Search Results for "{searchTerm}" | KWASU SU</title>
        <meta name="description" content={`Search results for ${searchTerm} across news, events, and opportunities.`} />
      </Helmet>
      <div className="container py-12">
        <div className="flex items-center mb-8">
          <Search className="h-8 w-8 text-brand-700 mr-3" />
          <h1 className="text-3xl font-bold text-brand-700">
            Search Results
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Showing {loading ? "..." : totalResults} results for: <span className="font-semibold text-brand-800">"{searchTerm}"</span>
        </p>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-8 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg p-6 border border-destructive rounded-lg">{error}</div>
        ) : totalResults === 0 ? (
          <Card className="p-8 text-center shadow-lg">
            <CardTitle className="text-2xl text-muted-foreground">No Results Found</CardTitle>
            <CardContent className="mt-4">
              <p>Try searching for different keywords or check the individual News and Events pages.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* News Results */}
            {results.news.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-brand-700 mb-4 flex items-center">
                  <Newspaper className="h-6 w-6 mr-2 text-brand-500" /> News Articles ({results.news.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.news.map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <Button asChild variant="link" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
                    <Link to="/news">View All News <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </section>
            )}

            {/* Events Results */}
            {results.events.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-brand-700 mb-4 flex items-center">
                  <CalendarDays className="h-6 w-6 mr-2 text-brand-500" /> Upcoming Events ({results.events.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.events.map((item) => (
                    <EventCard key={item.id} event={item} />
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <Button asChild variant="link" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
                    <Link to="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </section>
            )}

            {/* Opportunities Results */}
            {results.opportunities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-brand-700 mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-brand-500" /> Opportunities ({results.opportunities.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.opportunities.map((item) => (
                    <OpportunityResultCard key={item.id} opportunity={item} />
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <Button asChild variant="link" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
                    <Link to="/services/opportunities">View All Opportunities <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;