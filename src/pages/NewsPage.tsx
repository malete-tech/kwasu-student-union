"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem"; // Updated import
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card"; // Added Card for skeleton/error

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
        setError("Failed to load news. Please try again later.");
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
      currentNews = currentNews.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredNews(currentNews);
  }, [searchTerm, activeTag, allNews]);

  const uniqueTags = Array.from(new Set(allNews.flatMap(news => news.tags)));
  const featuredArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const gridArticles = filteredNews.slice(1);

  return (
    <>
      <Helmet>
        <title>News & Announcements | KWASU Students' Union</title>
        <meta name="description" content="Stay updated with the latest news and announcements from KWASU Students' Union." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-brand-700">News & Announcements</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
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
          <div className="space-y-6">
            {/* Featured Skeleton */}
            <Card className="flex flex-col md:flex-row h-96 shadow-lg rounded-2xl">
              <Skeleton className="h-1/2 md:h-full w-full md:w-2/5 flex-shrink-0" />
              <div className="p-6 w-full md:w-3/5 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </Card>
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden shadow-lg rounded-xl">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg">{error}</div>
        ) : filteredNews.length > 0 ? (
          <div className="space-y-10">
            {/* Featured Article */}
            {featuredArticle && (
              <NewsFeedItem news={featuredArticle} variant="featured" />
            )}

            {/* Grid Articles */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((newsItem) => (
                  <NewsFeedItem key={newsItem.id} news={newsItem} variant="default" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No news found matching your criteria.</p>
        )}
      </div>
    </>
  );
};

export default NewsPage;