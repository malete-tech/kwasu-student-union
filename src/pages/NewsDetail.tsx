"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { News } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
      <div className="container py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card className="shadow-lg rounded-2xl p-6">
          <Skeleton className="h-64 w-full mb-6" /> {/* Added Skeleton for cover image */}
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-destructive text-lg">
        {error}
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container py-12 text-center text-muted-foreground text-lg">
        News article data is not available.
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{news.title} | KWASU Students' Union News</title>
        <meta name="description" content={news.excerpt} />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="outline" className="mb-8 border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
        </Button>

        <Card className="shadow-lg rounded-2xl p-6">
          {news.coverUrl && (
            <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
              <img
                src={news.coverUrl}
                alt={news.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-4xl font-bold text-brand-700 mb-2">{news.title}</CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Published on {format(new Date(news.publishedAt), "PPP")}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {news.bodyMd}
            </ReactMarkdown>
          </CardContent>
          <div className="flex flex-wrap gap-2 mt-6 border-t pt-4">
            <span className="flex items-center text-sm font-medium text-brand-700">
              <Tag className="mr-2 h-4 w-4" /> Tags:
            </span>
            {news.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default NewsDetail;