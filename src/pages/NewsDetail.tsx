"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { News } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Tag, Paperclip } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) {
        setError("News ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await api.news.getById(id);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-12">
        <Helmet>
          <title>Loading News... | KWASU SU</title>
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-8">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg rounded-2xl p-6">
          <CardContent className="text-center text-destructive text-lg">
            {error || "News article data is not available."}
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
      <div className="min-h-screen py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Button asChild variant="ghost" className="mb-10 text-brand-600 hover:text-brand-700 hover:bg-brand-50 -ml-4">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Link>
          </Button>

          <article>
            <header className="mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-brand-900 mb-6 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-brand-500" />
                  <span>Published {format(new Date(news.publishedAt), "PPP")}</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center text-sm font-medium text-brand-700">
                    <Tag className="mr-1 h-4 w-4" /> Tags:
                  </span>
                  {news.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700 hover:bg-brand-200 border-none">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </header>

            {news.coverUrl && (
              <div className="mb-12 group">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-brand-600 uppercase tracking-widest">
                  <Paperclip className="h-4 w-4" />
                  Attachment / Bulletin
                </div>
                <div className="relative inline-block w-full overflow-hidden bg-white p-3 border border-gray-200 shadow-sm rounded-lg">
                  <img
                    src={news.coverUrl}
                    alt={news.title}
                    className="w-full h-auto object-contain max-h-[700px] rounded-sm"
                  />
                </div>
              </div>
            )}

            <div className="prose max-w-none lg:prose-xl text-gray-800 prose-headings:text-brand-900 prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-strong:text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {news.bodyMd}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;