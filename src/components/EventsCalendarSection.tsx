"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Event } from "@/types";
import EventCard from "@/components/event-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EventsCalendarSection: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.getAll();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events calendar.");
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
    <Card className="shadow-lg rounded-2xl p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-brand-700">Events Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow-md"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        </div>
        <div className="relative">
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
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-3 w-full mb-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive text-sm text-center">{error}</div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.slice(0, 2).map((eventItem) => ( // Limit to 2 for homepage
              <EventCard key={eventItem.id} event={eventItem} className="shadow-sm" />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">No events found for this date or search.</p>
        )}
        <div className="text-center mt-4">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 px-6 py-3 focus-visible:ring-brand-gold">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCalendarSection;