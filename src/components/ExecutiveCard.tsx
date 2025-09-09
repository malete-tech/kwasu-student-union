"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Executive } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutiveCardProps {
  executive: Executive;
  className?: string;
}

const ExecutiveCard: React.FC<ExecutiveCardProps> = ({ executive, className }) => {
  return (
    <Card className={cn("flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl", className)}>
      <Avatar className="h-24 w-24 mb-4 border-2 border-brand-500">
        <AvatarImage src={executive.photoUrl || "/placeholder.svg"} alt={executive.name} />
        <AvatarFallback className="bg-brand-100 text-brand-700">
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-xl font-semibold leading-tight">
          <Link to={`/executives/${executive.slug}`} className="hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none">
            {executive.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-brand-600 font-medium">
          {executive.role}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 text-sm text-muted-foreground">
        <p>{executive.faculty}</p>
        <p className="text-xs mt-1">
          {executive.tenureStart.substring(0, 4)} - {executive.tenureEnd.substring(0, 4)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ExecutiveCard;