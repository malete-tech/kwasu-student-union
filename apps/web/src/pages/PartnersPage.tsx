"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Partner } from "@/types";
import PartnerCard from "@/components/PartnerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FadeIn from "@/components/FadeIn";

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
      <SEO
        title="Official Partners & Sponsors | KWASU SU"
        description="Discover corporate partners, sponsors, and organizations supporting Kwara State University Students' Union programs."
        url="https://kwasusu.com.ng/partners"
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

        <div className="container relative py-12 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-bold text-brand-300 hover:text-white mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px] mr-2" aria-hidden="true" />
              Back to Home
            </Link>
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Collaborations & Alliances
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Official{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Partners & Sponsors
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              We collaborate with vetted organizations to deliver improved services, opportunities, and value for the KWASU student body.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-gold text-brand-900 hover:bg-brand-gold/90 text-xs font-bold transition-colors shrink-0"
          >
            <i className="fa-solid fa-handshake" aria-hidden="true" />
            Become a Partner
          </Link>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto py-10 px-4">
        {/* Search & Category Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <Input
              placeholder="Search partners by name, sector, or service..."
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

          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors border",
                  activeCategory === null
                    ? "bg-brand-900 text-white border-brand-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                All Categories ({allPartners.length})
              </button>
              {categories.map((cat) => {
                const count = allPartners.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors border",
                      activeCategory === cat
                        ? "bg-brand-900 text-white border-brand-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded p-4 space-y-3 bg-white">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : filteredPartners.length > 0 ? (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </FadeIn>
        ) : (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <i className="fa-solid fa-handshake-slash text-2xl text-gray-300 mb-2 block" />
            <p className="text-xs font-semibold text-gray-600 mb-1">No partners found</p>
            <p className="text-[11px] text-gray-400">
              No matching partners were found for your search.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PartnersPage;