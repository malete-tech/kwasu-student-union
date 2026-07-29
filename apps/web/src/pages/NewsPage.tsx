"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem";
import { Input } from "@/components/ui/input";
import { Search } from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AdPlacement from "@/components/AdPlacement";
import FadeIn from "@/components/FadeIn";

const NewsPage: React.FC = () => {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.news.getAll();
        setAllNews(
          data.sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
        );
        setFilteredNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    let currentNews = allNews;
    if (activeTag) {
      currentNews = currentNews.filter((news) =>
        news.tags.includes(activeTag)
      );
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentNews = currentNews.filter(
        (news) =>
          news.title.toLowerCase().includes(lowerSearch) ||
          news.excerpt.toLowerCase().includes(lowerSearch) ||
          news.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredNews(currentNews);
  }, [searchTerm, activeTag, allNews]);

  const uniqueTags = Array.from(
    new Set(allNews.flatMap((news) => news.tags))
  );

  const isFiltering = !!searchTerm || !!activeTag;

  return (
    <>
      <Helmet>
        <title>Latest Campus News & Announcements | KWASU SU</title>
        <meta
          name="description"
          content="Official announcements, campus updates, and student news from the Kwara State University Students' Union (KWASU SU)."
        />
        <link rel="canonical" href="https://thekwasusu.com/news" />
      </Helmet>

      {/* ── PAGE BANNER ─────────────────────────────────────────────────── */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        {/* Subtle grid texture */}
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
              KWASU Students' Union
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              News &amp;{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Announcements
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Official updates, policy changes, and important notices for the
              KWASU student body.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container py-4 space-y-3">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, tag, or content…"
              className="h-9 pl-10 pr-16 text-sm rounded border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={cn(
                "h-7 px-3 rounded text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 border",
                activeTag === null
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              All
              <span
                className={cn(
                  "ml-1.5 text-[10px]",
                  activeTag === null ? "text-brand-300" : "text-gray-400"
                )}
              >
                {allNews.length}
              </span>
            </button>

            {uniqueTags.map((tag) => {
              const count = allNews.filter((n) => n.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "h-7 px-3 rounded text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 border",
                    activeTag === tag
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-700"
                  )}
                >
                  {tag}
                  <span
                    className={cn(
                      "ml-1.5 text-[10px]",
                      activeTag === tag ? "text-brand-300" : "text-gray-400"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Article list */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-6">
                    <Skeleton className="w-24 h-20 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-3 w-24 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center text-sm text-red-500">
                {error}
              </div>
            ) : filteredNews.length > 0 ? (
              <FadeIn>
                <div className="divide-y divide-gray-100">
                  {filteredNews.map((newsItem) => (
                    <NewsFeedItem
                      key={newsItem.id}
                      news={newsItem}
                      variant="list"
                    />
                  ))}
                </div>
              </FadeIn>
            ) : (
              /* Empty state */
              <div className="py-20 flex flex-col items-center text-center">
                <i className="fa-solid fa-newspaper text-4xl text-gray-200 mb-4" />
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  No articles found
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  {isFiltering
                    ? "Try adjusting your search or clearing the active filter."
                    : "No news has been published yet."}
                </p>
                {isFiltering && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveTag(null);
                    }}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AdPlacement placement="news_feed" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsPage;