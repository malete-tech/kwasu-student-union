"use client";

import React from "react";
import { Link } from "react-router-dom";
import { News } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDays } from "@/components/ui/font-awesome-icon";

interface NewsFeedItemProps {
  news: News;
  variant?: "default" | "featured" | "list";
  className?: string;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ news, variant = "default", className }) => {
  const linkClasses = "hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none transition-colors";

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "flex flex-col md:flex-row overflow-hidden border border-gray-100 transition-shadow duration-200 hover:shadow-md rounded bg-white",
          className
        )}
      >
        {news.coverUrl && (
          <div className="relative w-full md:w-1/2 lg:w-2/5 aspect-video md:aspect-auto overflow-hidden flex-shrink-0">
            <img
              src={news.coverUrl}
              alt={news.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col p-6 md:w-1/2 lg:w-3/5">
          <div className="pb-3">
            <h3 className="text-2xl md:text-3xl font-bold leading-snug">
              <Link to={`/news/${news.id}`} className={linkClasses}>
                {news.title}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <CalendarDays className="mr-2 h-4 w-4 text-brand-500" />
              <span>{format(new Date(news.publishedAt), "PPP")}</span>
            </div>
          </div>
          <div className="flex-grow">
            <p className="text-base text-gray-700 line-clamp-4">
              {news.excerpt}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <Link
        to={`/news/${news.id}`}
        className={cn(
          "flex gap-4 items-start py-5 group border-l-2 border-transparent hover:border-brand-500 pl-3 -ml-3 transition-colors duration-150",
          className
        )}
      >
        {/* Thumbnail */}
        <div className="w-20 h-16 sm:w-28 sm:h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-100">
          {news.coverUrl ? (
            <img
              src={news.coverUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-gray-300" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm sm:text-base font-bold text-brand-900 leading-snug line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">
            {news.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
            {news.excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <CalendarDays className="h-3 w-3 text-brand-400" />
            {format(new Date(news.publishedAt), "dd MMMM yyyy")}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all duration-150 rounded bg-white",
        className
      )}
    >
      {news.coverUrl && (
        <Link
          to={`/news/${news.id}`}
          className="relative h-44 w-full overflow-hidden block"
        >
          <img
            src={news.coverUrl}
            alt={news.title}
            className="h-full w-full object-cover"
          />
        </Link>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-brand-900 leading-snug line-clamp-2 mb-2">
          <Link to={`/news/${news.id}`} className={linkClasses}>
            {news.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
          {news.excerpt}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {news.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedItem;