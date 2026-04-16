"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Partner } from "@/types";
import PartnerCard from "@/components/PartnerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Handshake, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PartnersPage: React.FC = () => {
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.partners.getAll();
        setAllPartners(data);
        setFilteredPartners(data);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
        setError("Failed to load partners directory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    let current = allPartners;

    if (activeCategory) {
      current = current.filter(p => p.category === activeCategory);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      current = current.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
      );
    }

    setFilteredPartners(current);
  }, [searchTerm, activeCategory, allPartners]);

  const categories = Array.from(new Set(allPartners.map(p => p.category)));

  return (
    <>
      <Helmet>
        <title>Our Partners | KWASU Students' Union</title>
        <meta name="description" content="Discover organizations and businesses in good standing with the KWASU Students' Union." />
      </Helmet>

      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Button asChild variant="ghost" className="mb-4 text-brand-600 hover:text-brand-700 -ml-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-700 flex items-center gap-3">
              <Handshake className="h-10 w-10 text-brand-500" /> Official Partners
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              We collaborate with vetted organizations to bring better services, opportunities, and value to the KWASU student body.
            </p>
          </div>
          <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl px-6 h-12 font-bold shadow-lg">
            <Link to="/contact">
              <PlusCircle className="mr-2 h-4 w-4" /> Become a Partner
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-300" />
            <Input
              placeholder="Search partners by name or service..."
              className="h-12 pl-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={activeCategory === null ? "default" : "secondary"}
              className={cn(
                "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider whitespace-nowrap",
                activeCategory === null ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
              )}
              onClick={() => setActiveCategory(null)}
            >
              All Categories
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "secondary"}
                className={cn(
                  "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider whitespace-nowrap",
                  activeCategory === cat ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 rounded-2xl border border-brand-50 bg-white shadow-sm">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive font-medium bg-red-50 rounded-2xl">{error}</div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No partners found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PartnersPage;
