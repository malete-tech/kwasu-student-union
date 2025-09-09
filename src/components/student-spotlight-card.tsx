"use client";

import React from "react";
import { Link } from "react-router-dom";
import { StudentSpotlight } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudentSpotlightCardProps {
  spotlight: StudentSpotlight;
  className?: string;
}

const StudentSpotlightCard: React.FC<StudentSpotlightCardProps> = ({ spotlight, className }) => {
  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      {spotlight.photoUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={spotlight.photoUrl}
            alt={spotlight.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-tight">
          {spotlight.link ? (
            <Link to={spotlight.link} className="hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none">
              {spotlight.name}
            </Link>
          ) : (
            spotlight.name
          )}
        </CardTitle>
        <CardDescription className="text-sm text-brand-600 font-medium">
          {spotlight.achievement}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">
          {spotlight.descriptionMd.split('\n')[0]} {/* Take first line as excerpt */}
        </p>
      </CardContent>
    </Card>
  );
};

export default StudentSpotlightCard;