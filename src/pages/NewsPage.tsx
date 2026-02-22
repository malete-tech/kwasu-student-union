"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <title>News & Announcements | KWASU Students' Union</title>
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

        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-5xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-300" />
            <Input
              placeholder="Search news by title or content..."
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
              All News
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 max-w-7xl mx-auto">
            {filteredNews.map((newsItem) => (
              <NewsFeedItem key={newsItem.id} news={newsItem} variant="list" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">No news found matching your criteria.</div>
        )}
      </div>
    </>
  );
};

export default NewsPage;