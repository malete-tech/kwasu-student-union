"use client";

import React from "react";
import { Link } from "react-router-dom";
import { News } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface NewsFeedItemProps {
  news: News;
  variant?: "default" | "featured";
  className?: string;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ news, variant = "default", className }) => {
  const isFeatured = variant === "featured";

  const linkClasses = "hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none";

  if (isFeatured) {
    return (
      <Card className={cn("flex flex-col md:flex-row overflow-hidden shadow-xl transition-shadow duration-300 rounded-2xl", className)}>
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
          <CardHeader className="pb-3 px-0 pt-0">
            <CardTitle className="text-2xl md:text-3xl font-bold leading-snug">
              <Link to={`/news/${news.slug}`} className={linkClasses}>
                {news.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4 text-brand-500" />
              <span>Published on {format(new Date(news.publishedAt), "PPP")}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow px-0">
            <p className="text-base text-gray-700 line-clamp-4">
              {news.excerpt}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 pt-4 px-0">
            {news.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </div>
      </Card>
    );
  }

  // Default (Grid) Variant
  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl", className)}>
      {news.coverUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={news.coverUrl}
            alt={news.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-tight truncate">
          <Link to={`/news/${news.slug}`} className={linkClasses}>
            {news.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex items-center">
          <CalendarDays className="mr-1 h-3 w-3" />
          {format(new Date(news.publishedAt), "MMM dd, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-2">
          {news.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        {news.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default NewsFeedItem;