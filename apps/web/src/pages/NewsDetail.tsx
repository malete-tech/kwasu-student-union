"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { api } from "@/lib/api";
import { News } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import AdPlacement from "@/components/AdPlacement";
import FadeIn from "@/components/FadeIn";

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

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading… | KWASU SU</title>
        </Helmet>

        {/* Skeleton banner */}
        <div className="w-full bg-brand-900 py-12 md:py-16">
          <div className="container">
            <Skeleton className="h-3 w-32 mb-5 bg-brand-700" />
            <Skeleton className="h-8 w-3/4 mb-3 bg-brand-700" />
            <Skeleton className="h-8 w-1/2 bg-brand-700" />
            <Skeleton className="h-3 w-40 mt-5 bg-brand-700" />
          </div>
        </div>

        <div className="container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-[16/9] rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <Skeleton className="h-80 w-full rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error || !news) {
    return (
      <div className="container py-20 text-center">
        <p className="text-sm text-red-500 mb-6">
          {error || "News article data is not available."}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-brand-300 text-brand-600 hover:bg-brand-50 text-xs font-bold uppercase tracking-wider"
        >
          <Link to="/news">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to News
          </Link>
        </Button>
      </div>
    );
  }

  // ── Article ──────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title={`${news.title} | KWASU Students' Union News`}
        description={news.excerpt}
        image={news.coverUrl || "https://kwasusu.com.ng/logo.png"}
        url={`https://kwasusu.com.ng/news/${news.id}`}
        type="article"
        publishedAt={news.publishedAt}
        tags={news.tags}
      />

      {/* ── ARTICLE BANNER ───────────────────────────────────────────────── */}
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

        <div className="container relative py-10 md:py-14">
          {/* Back link / breadcrumb */}
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-200 text-xs font-bold uppercase tracking-[0.12em] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            News &amp; Announcements
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-5">
              {news.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-brand-300 text-xs font-medium">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{format(new Date(news.publishedAt), "dd MMMM yyyy")}</span>
              </div>

              {news.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {news.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-400 bg-brand-800 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────────────────────── */}
      <div className="container py-10 pb-16">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Main content */}
            <div className="lg:col-span-2">
              <article>
                {/* Cover image — full width, no framing chrome */}
                {news.coverUrl && (
                  <div className="mb-10 w-full overflow-hidden rounded bg-gray-50 border border-gray-100">
                    <img
                      src={news.coverUrl}
                      alt={news.title}
                      className="w-full h-auto object-contain max-h-[680px]"
                    />
                  </div>
                )}

                {/* Body */}
                <div className="prose prose-slate prose-base md:prose-lg max-w-none break-words
                  prose-headings:text-brand-900 prose-headings:font-bold
                  prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-brand-800
                  prose-blockquote:border-l-brand-400 prose-blockquote:text-gray-600
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {news.bodyMd}
                  </ReactMarkdown>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AdPlacement placement="news_feed" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
};

export default NewsDetail;