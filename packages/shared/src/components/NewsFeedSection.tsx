"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { News } from "@/types";
import NewsFeedItem from "@/components/NewsFeedItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface NewsFeedSectionProps {
  /** If true, shows the search/tag filter bar. Use on the /news page. */
  withFilters?: boolean;
  /** Max items to show. Defaults to 4 for homepage, use higher for /news page. */
  limit?: number;
}

const NewsFeedSection: React.FC<NewsFeedSectionProps> = ({
  withFilters: _withFilters = false,
  limit = 4,
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.news.getAll();
        setNews(
          data
            .sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
            )
            .slice(0, limit)
        );
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [limit]);

  return (
    <div className="space-y-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-0.5">
            KWASU Students' Union
          </p>
          <h2 className="text-lg font-bold text-gray-900 leading-snug">
            Latest News
          </h2>
        </div>
        <Link
          to="/news"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View all <i className="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded">
          {/* Lead skeleton */}
          <div className="flex gap-4 p-4">
            <Skeleton className="w-32 h-24 rounded flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 p-4">
              <Skeleton className="w-16 h-12 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-500 border border-red-100 rounded bg-red-50/50">
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400">
          <i className="fa-solid fa-newspaper text-3xl text-gray-200 mb-3" />
          <p>No news published yet.</p>
        </div>
      ) : (
        <div className="border border-gray-100 rounded divide-y divide-gray-100 bg-white">
          {/* Lead article — featured variant */}
          <NewsFeedItem news={news[0]!} variant="featured" />

          {/* Supporting articles — list variant */}
          {news.slice(1).map((item) => (
            <div key={item.id} className="px-4">
              <NewsFeedItem news={item} variant="list" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeedSection;