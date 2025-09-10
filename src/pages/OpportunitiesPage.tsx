"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Opportunity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added CardFooter import
import { Button } from "@/components/ui/button";
import { CalendarDays, LinkIcon, Search } from "lucide-react"; // Removed Briefcase, Tag
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const deadlineDate = new Date(opportunity.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <Card className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl ${isDeadlinePast ? "opacity-70 grayscale" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-tight">
          <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none">
            {opportunity.title}
          </a>
        </CardTitle>
        {opportunity.sponsor && (
          <CardDescription className="text-sm text-muted-foreground">
            Sponsor: {opportunity.sponsor}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow text-sm text-gray-700">
        <p className="mb-2 line-clamp-3">{opportunity.descriptionMd}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>
            Deadline: {format(deadlineDate, "PPP")}
            {isDeadlinePast && <span className="ml-2 text-destructive font-medium">(Closed)</span>}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        {opportunity.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
            {tag}
          </Badge>
        ))}
        <Button asChild size="sm" className="ml-auto bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold" disabled={isDeadlinePast}>
          <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
            Apply <LinkIcon className="ml-2 h-4 w-4" />
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
      currentOpportunities = currentOpportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.descriptionMd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.sponsor && opp.sponsor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredOpportunities(currentOpportunities);
  }, [searchTerm, activeTag, allOpportunities]);

  const uniqueTags = Array.from(new Set(allOpportunities.flatMap(opp => opp.tags)));

  return (
    <>
      <Helmet>
        <title>Opportunities | KWASU Students' Union</title>
        <meta name="description" content="Discover scholarships, internships, jobs, and other valuable opportunities for KWASU students." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Student Opportunities</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              className="pl-9 pr-3 py-2 rounded-md border focus-visible:ring-brand-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={activeTag === null ? "default" : "secondary"}
              className={activeTag === null ? "bg-brand-500 text-white hover:bg-brand-600 cursor-pointer" : "bg-brand-100 text-brand-700 hover:bg-brand-200 cursor-pointer"}
              onClick={() => setActiveTag(null)}
            >
              All
            </Badge>
            {uniqueTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "secondary"}
                className={activeTag === tag ? "bg-brand-500 text-white hover:bg-brand-600 cursor-pointer" : "bg-brand-100 text-brand-700 hover:bg-brand-200 cursor-pointer"}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden shadow-lg rounded-xl">
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg">{error}</div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No opportunities found matching your criteria.</p>
        )}
      </div>
    </>
  );
};

export default OpportunitiesPage;