"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FadeIn from "@/components/FadeIn";

const DownloadsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get("tag");
  const initialSearch = searchParams.get("search");

  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag || null);

  useEffect(() => {
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    setActiveTag(tag);
    setSearchTerm(search || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await api.documents.getAll();
        setAllDocuments(data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        setFilteredDocuments(data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    let currentDocuments = allDocuments;

    if (activeTag) {
      currentDocuments = currentDocuments.filter(doc => doc.tags.includes(activeTag));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentDocuments = currentDocuments.filter(doc =>
        doc.title.toLowerCase().includes(lowerSearch) ||
        doc.fileType.toLowerCase().includes(lowerSearch) ||
        doc.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredDocuments(currentDocuments);
  }, [searchTerm, activeTag, allDocuments]);

  const uniqueTags = Array.from(new Set(allDocuments.flatMap(doc => doc.tags)));

  return (
    <>
      <SEO
        title="Downloads Vault | KWASU Students' Union"
        description="Download official Kwara State University Students' Union documents, constitutions, handbooks, forms, and academic resources."
        url="https://kwasusu.com.ng/services/downloads"
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
              Digital Repository & Vault
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Important{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Downloads
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Access official university handbooks, union constitutions, forms, and essential student resources.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto py-10 px-4">
        {/* Search & Tag Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <Input
              placeholder="Search documents by title, tag, or format..."
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

          {uniqueTags.length > 0 && (
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
                All Files ({allDocuments.length})
              </button>
              {uniqueTags.map((tag) => {
                const count = allDocuments.filter(d => d.tags.includes(tag)).length;
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
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded p-4 space-y-3 bg-white">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center text-xs font-medium text-red-600 bg-red-50/50 rounded border border-red-100">
            {error}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group border border-gray-100 hover:border-gray-300 bg-white rounded p-4 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-file-pdf text-sm" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {doc.fileType} • {doc.fileSize}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-400 font-medium">
                      Updated {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                    </span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
                    >
                      Download
                      <i className="fa-solid fa-download text-[10px]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        ) : (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded">
            <i className="fa-solid fa-folder-open text-2xl text-gray-300 mb-2 block" />
            <p className="text-xs font-semibold text-gray-600 mb-1">No documents found</p>
            <p className="text-[11px] text-gray-400">
              Try adjusting your search criteria or tag filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DownloadsPage;