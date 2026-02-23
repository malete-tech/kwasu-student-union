"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const deadlineDate = new Date(opportunity.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <Card className={cn(
      "flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-brand-50",
      isDeadlinePast ? "opacity-70 grayscale bg-slate-50" : "bg-white/50 hover:bg-white"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
            <i className="fa-solid fa-briefcase text-xl"></i>
          </div>
          {isDeadlinePast && (
            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter border-red-100 bg-red-50 text-red-600">Closed</Badge>
          )}
        </div>
        <CardTitle className="text-xl font-bold leading-tight text-brand-900 group-hover:text-brand-600 transition-colors">
          {opportunity.title}
        </CardTitle>
        {opportunity.sponsor && (
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
            Sponsor: {opportunity.sponsor}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow text-sm text-gray-700">
        <p className="mb-4 line-clamp-3 leading-relaxed">{opportunity.descriptionMd}</p>
        <div className="flex items-center text-xs font-medium text-slate-500">
          <i className="fa-solid fa-calendar-day mr-2 text-brand-400"></i>
          <span>
            Deadline: {format(deadlineDate, "PPP")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-brand-50 mt-auto">
        <div className="flex flex-wrap gap-1 flex-1">
          {opportunity.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[9px] uppercase py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild size="sm" className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-sm px-6 font-bold" disabled={isDeadlinePast}>
          <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
            Apply <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"></i>
          </a>
        </Button>
      </CardFooter>
    </Card>
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
      <Helmet>
        <title>Opportunities | KWASU Students' Union</title>
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/services">
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Services
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Student Opportunities</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Explore scholarships, internships, and career development programs curated for your academic and professional growth.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-5xl mx-auto">
          <div className="relative flex-grow">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-300"></i>
            <Input
              placeholder="Search opportunities by title, sponsor, or keyword..."
              className="h-12 pl-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={activeTag === null ? "default" : "secondary"}
              className={cn(
                "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider",
                activeTag === null ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
              )}
              onClick={() => setActiveTag(null)}
            >
              All Types
            </Badge>
            {uniqueTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "secondary"}
                className={cn(
                  "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider",
                  activeTag === tag ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
                )}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 rounded-2xl shadow-sm border-brand-50 space-y-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive font-medium">{error}</div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            No opportunities found matching your search criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default OpportunitiesPage;