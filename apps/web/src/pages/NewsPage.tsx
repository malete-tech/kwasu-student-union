"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdPlacement from "@/components/AdPlacement";

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
        setAllNews(data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
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
      currentNews = currentNews.filter(news => news.tags.includes(activeTag));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentNews = currentNews.filter(news =>
        news.title.toLowerCase().includes(lowerSearch) ||
        news.excerpt.toLowerCase().includes(lowerSearch) ||
        news.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredNews(currentNews);
  }, [searchTerm, activeTag, allNews]);

  const uniqueTags = Array.from(new Set(allNews.flatMap(news => news.tags)));

  return (
    <>
      <Helmet>
        <title>Latest Campus News & Announcements | KWASU SU</title>
        <meta name="description" content="Official announcements, campus updates, and student news from the Kwara State University Students' Union (KWASU SU)." />
        <link rel="canonical" href="https://thekwasusu.com/news" />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">News & Announcements</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Stay informed with official updates, policy changes, and important notices for the student body.
        </p>

        {/* Search & Category Filter Section */}
        <div className="space-y-4 mb-10 max-w-5xl mx-auto">
          {/* Full-width Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search news by title, category, or content..."
              className="h-11 pl-11 pr-16 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Category Filters with Hidden Scrollbar */}
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={cn(
                  "h-8 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 shadow-sm",
                  activeTag === null
                    ? "bg-brand-800 text-white border-brand-800 shadow-brand-700/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50"
                )}
              >
                <span>All News</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                  activeTag === null ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {allNews.length}
                </span>
              </button>

              {uniqueTags.map((tag) => {
                const count = allNews.filter(news => news.tags.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "h-8 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 shadow-sm",
                      activeTag === tag
                        ? "bg-brand-800 text-white border-brand-800 shadow-brand-700/20"
                        : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50"
                    )}
                  >
                    <span>{tag}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                      activeTag === tag ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 gap-y-10">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-32 h-24 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive font-medium">{error}</div>
            ) : filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-y-12">
                {filteredNews.map((newsItem) => (
                  <NewsFeedItem key={newsItem.id} news={newsItem} variant="list" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground italic">No news found matching your criteria.</div>
            )}
          </div>

          {/* Sidebar with Ad Placement */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-4">Sponsored Content</h3>
              <AdPlacement placement="news_feed" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsPage;