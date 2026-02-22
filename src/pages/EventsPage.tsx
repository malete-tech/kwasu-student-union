"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Event } from "@/types";
import EventCard from "@/components/event-card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EventsPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.getAll();
        setAllEvents(data.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()));
        setFilteredEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let currentEvents = allEvents;

    if (selectedDate) {
      currentEvents = currentEvents.filter(event => {
        const eventStartDate = new Date(event.startsAt);
        const eventEndDate = event.endsAt ? new Date(event.endsAt) : eventStartDate;
        return (
          selectedDate.toDateString() >= eventStartDate.toDateString() &&
          selectedDate.toDateString() <= eventEndDate.toDateString()
        );
      });
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(lowerSearch) ||
        event.descriptionMd.toLowerCase().includes(lowerSearch) ||
        event.venue.toLowerCase().includes(lowerSearch) ||
        event.category.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredEvents(currentEvents.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()));
  }, [searchTerm, selectedDate, allEvents]);

  const modifiers = {
    hasEvent: allEvents.map(event => new Date(event.startsAt)),
  };

  const modifiersClassNames = {
    hasEvent: "bg-brand-500 text-white rounded-full",
  };

  return (
    <>
      <Helmet>
        <title>Events & Calendar | KWASU Students' Union</title>
        <meta name="description" content="Explore upcoming events, workshops, and social gatherings organized by KWASU Students' Union." />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Campus Events</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          From academic summits to cultural celebrations, stay updated with everything happening across the campus.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-full max-w-sm p-4 bg-white rounded-2xl shadow-xl border border-brand-50">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-4 px-2">Filter by Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex justify-center"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
              <Button
                variant="outline"
                onClick={() => setSelectedDate(undefined)}
                disabled={!selectedDate}
                className="mt-4 w-full rounded-xl border-brand-100 text-brand-600 hover:bg-brand-50"
              >
                Clear Calendar Selection
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-300" />
              <Input
                placeholder="Search events by title, venue, or category..."
                className="h-12 pl-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="flex flex-col h-[200px] overflow-hidden shadow-lg rounded-xl">
                    <div className="p-4 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive font-medium bg-red-50 rounded-2xl">{error}</div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((eventItem) => (
                  <EventCard key={eventItem.id} event={eventItem} className="h-full" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-muted-foreground italic">No events found for the selected criteria.</p>
                {selectedDate && (
                   <Button variant="link" onClick={() => setSelectedDate(undefined)} className="mt-2 text-brand-500">
                     View all upcoming events
                   </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;