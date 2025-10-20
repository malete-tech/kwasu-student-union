"use client";

import React from "react";
import { Link } from "react-router-dom";
import { News } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  news: News;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, className }) => {
  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      {/* Removed news.coverUrl image display */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-tight">
          <Link to={`/news/${news.slug}`} className="hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none">
            {news.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {format(new Date(news.publishedAt), "PPP")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700">
          {news.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        {news.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-brand-100 text-brand-700">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;