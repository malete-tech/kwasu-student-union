"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { News } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card"; // Kept for error/fallback display

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) {
        setError("News slug is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await api.news.getBySlug(slug);
        if (data) {
          setNews(data);
        } else {
          setError("News article not found.");
        }
      } catch (err) {
        console.error("Failed to fetch news details:", err);
        setError("Failed to load news details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Helmet>
          <title>Loading News... | KWASU SU</title>
        </Helmet>
        <Skeleton className="h-64 w-full mb-12" /> {/* Full width image skeleton */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-8">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg rounded-2xl p-6">
          <CardContent className="text-center text-destructive text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg rounded-2xl p-6">
          <CardContent className="text-center text-muted-foreground text-lg">
            News article data is not available.
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{news.title} | KWASU Students' Union News</title>
        <meta name="description" content={news.excerpt} />
      </Helmet>
      <div className="min-h-screen">
        {/* Full-Width Cover Image Section */}
        {news.coverUrl && (
          <div className="w-full aspect-video bg-gray-100 mb-12 shadow-xl">
            <img
              src={news.coverUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content Area (Constrained and Centered) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Button asChild variant="outline" className="mb-8 border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Link>
          </Button>

          {/* Header and Metadata */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 mb-4 leading-tight">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-brand-500" />
                <span>Published on {format(new Date(news.publishedAt), "PPP")}</span>
              </div>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-sm font-medium text-brand-700">
                  <Tag className="mr-1 h-4 w-4" /> Tags:
                </span>
                {news.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Body Content */}
          <div className="prose max-w-none lg:prose-lg text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {news.bodyMd}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;