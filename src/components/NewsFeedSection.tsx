"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem"; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const NewsFeedSection: React.FC = () => {
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
        setAllNews(data);
        setFilteredNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news feed.");
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

  return (
    <Card className="shadow-lg rounded-2xl p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-brand-700">Latest News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-sm">
                <Skeleton className="h-32 w-full flex-shrink-0" />
                <div className="p-4 flex-grow space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-sm text-center">{error}</div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(0, 3).map((newsItem) => ( // Limit to 3 for homepage
              <NewsFeedItem key={newsItem.id} news={newsItem} variant="default" />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">No news found matching your criteria.</p>
        )}
        <div className="text-center mt-4">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 px-6 py-3 focus-visible:ring-brand-gold">
            <Link to="/news">View All News</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsFeedSection;