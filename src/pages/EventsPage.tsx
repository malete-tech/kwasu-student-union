"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Event } from "@/types";
import EventCard from "@/components/event-card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { format } from "date-fns"; // Removed unused import
import { Button } from "@/components/ui/button"; // Added Button import

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
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.descriptionMd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Events & Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow-md w-full max-w-sm"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
            <Button
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
              className="mt-4 w-full max-w-sm border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold"
            >
              Clear Date Selection
            </Button>
          </div>
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9 pr-3 py-2 rounded-md border focus-visible:ring-brand-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col overflow-hidden shadow-lg rounded-xl">
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-destructive text-lg">{error}</div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((eventItem) => (
                  <EventCard key={eventItem.id} event={eventItem} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-lg">No events found for this date or search criteria.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;