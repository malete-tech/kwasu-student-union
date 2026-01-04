"use client";

import React from "react";
import { Link } from "react-router-dom";
import { News } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDays, User } from "lucide-react";

interface NewsFeedItemProps {
  news: News;
  variant?: "default" | "featured" | "list";
  className?: string;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ news, variant = "default", className }) => {
  const linkClasses = "hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none transition-colors";

  if (variant === "featured") {
    return (
      <div className={cn("flex flex-col md:flex-row overflow-hidden shadow-xl transition-shadow duration-300 rounded-2xl bg-white", className)}>
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
              <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("flex gap-4 items-start group", className)}>
        <div className="w-24 h-20 sm:w-32 sm:h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 border">
          {news.coverUrl ? (
            <img 
              src={news.coverUrl} 
              alt={news.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <CalendarDays className="h-8 w-8 opacity-20" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-2 mb-1">
            <Link to={`/news/${news.id}`} className={linkClasses}>
              {news.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
            {news.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
              {format(new Date(news.publishedAt), "dd MMMM yyyy")}
            </div>
            <div className="flex items-center gap-1.5 border-l pl-4 border-gray-200">
              <User className="h-3.5 w-3.5 text-brand-500" />
              SU Admin
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-white", className)}>
      {news.coverUrl && (
        <Link to={`/news/${news.id}`} className="relative h-48 w-full overflow-hidden block group">
          <img
            src={news.coverUrl}
            alt={news.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="pb-2">
          <h3 className="text-xl font-semibold leading-tight line-clamp-2">
            <Link to={`/news/${news.id}`} className={linkClasses}>
              {news.title}
            </Link>
          </h3>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <CalendarDays className="mr-1 h-3 w-3 text-brand-500" />
            {format(new Date(news.publishedAt), "MMM dd, yyyy")}
          </div>
        </div>
        <div className="flex-grow py-2">
          <p className="text-sm text-gray-700 line-clamp-3">
            {news.excerpt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-4 mt-auto">
          {news.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedItem;