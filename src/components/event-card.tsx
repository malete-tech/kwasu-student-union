"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Event } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MapPin, CalendarDays, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const startDate = new Date(event.startsAt);
  const endDate = event.endsAt ? new Date(event.endsAt) : null;

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-tight">
          <Link to={`/events/${event.slug}`} className="hover:text-brand-500 focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md outline-none">
            {event.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-1 h-4 w-4" />
          <span>
            {format(startDate, "MMM dd, yyyy")}
            {endDate && format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd")
              ? ` - ${format(endDate, "MMM dd, yyyy")}`
              : ` at ${format(startDate, "p")}`}
          </span>
        </CardDescription>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{event.venue}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">
          {event.descriptionMd.split('\n')[0]} {/* Take first line as excerpt */}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        <Badge variant="secondary" className="bg-brand-100 text-brand-700">
          {event.category}
        </Badge>
        {event.rsvpOpen && (
          <Badge className="bg-brand-500 text-white">RSVP Open</Badge>
        )}
        {event.rsvpOpen && event.rsvpLink && (
          <Button asChild size="sm" className="ml-auto bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold">
            <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer">
              RSVP <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;