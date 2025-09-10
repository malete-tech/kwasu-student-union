"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Event } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, MapPin, Tag, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) {
        setError("Event slug is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await api.events.getBySlug(slug);
        if (data) {
          setEvent(data);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card className="shadow-lg rounded-2xl p-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-destructive text-lg">
        {error}
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-12 text-center text-muted-foreground text-lg">
        Event data is not available.
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startsAt);
  const endDate = event.endsAt ? new Date(event.endsAt) : null;

  return (
    <>
      <Helmet>
        <title>{event.title} | KWASU Students' Union Events</title>
        <meta name="description" content={event.descriptionMd.split('\n')[0]} />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="outline" className="mb-8 border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>

        <Card className="shadow-lg rounded-2xl p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-4xl font-bold text-brand-700 mb-2">{event.title}</CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground mb-1">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>
                {format(startDate, "PPP")}
                {endDate && format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd")
                  ? ` - ${format(endDate, "PPP")}`
                  : ""}
              </span>
            </CardDescription>
            <CardDescription className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {format(startDate, "p")}
                {endDate && format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd") && ` - ${format(endDate, "p")}`}
              </span>
            </CardDescription>
            <CardDescription className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.venue}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {event.descriptionMd}
            </ReactMarkdown>

            {event.agendaMd && (
              <div className="mt-8 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500">
                <h3 className="text-xl font-semibold text-brand-700 mb-3">Agenda</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event.agendaMd}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
          <div className="flex flex-wrap gap-2 mt-6 border-t pt-4">
            <span className="flex items-center text-sm font-medium text-brand-700">
              <Tag className="mr-2 h-4 w-4" /> Category:
            </span>
            <Badge variant="secondary" className="bg-brand-100 text-brand-700">
              {event.category}
            </Badge>
            {event.rsvpOpen && (
              <Badge className="bg-brand-500 text-white">RSVP Open</Badge>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default EventDetail;