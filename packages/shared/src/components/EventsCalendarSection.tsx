"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Event } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EventsCalendarSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.getAll();
        const now = new Date();
        const upcoming = data
          .filter((e) => new Date(e.startsAt) >= now)
          .sort(
            (a, b) =>
              new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
          )
          .slice(0, 3);
        setEvents(upcoming);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load upcoming events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-0.5">
            Upcoming
          </p>
          <h2 className="text-lg font-bold text-gray-900 leading-snug">
            Events Calendar
          </h2>
        </div>
        <Link
          to="/events"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View all <i className="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 border border-gray-100 rounded p-4 bg-white">
              <Skeleton className="w-12 h-14 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center text-sm text-red-500 border border-red-100 rounded bg-red-50/50">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400 border border-gray-100 rounded bg-white">
          <i className="fa-solid fa-calendar-xmark text-3xl text-gray-200 mb-3" />
          <p>No upcoming events scheduled.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const start = new Date(event.startsAt);
            return (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className={cn(
                  "group flex items-start gap-4 border border-gray-100 rounded p-4 bg-white",
                  "hover:border-brand-300 hover:shadow-sm transition-all duration-150"
                )}
                id={`event-item-${event.slug}`}
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 w-12 text-center border border-gray-100 rounded bg-brand-50 py-1.5">
                  <p className="text-[10px] font-bold text-brand-500 uppercase leading-none">
                    {format(start, "MMM")}
                  </p>
                  <p className="text-xl font-extrabold text-brand-900 leading-none mt-0.5">
                    {format(start, "dd")}
                  </p>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 mb-1 group-hover:text-brand-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <i className="fa-solid fa-location-dot text-brand-400 text-[10px]" aria-hidden="true" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold mt-1">
                    <span className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {event.category}
                    </span>
                    {event.rsvpOpen && (
                      <span className="text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        RSVP Open
                      </span>
                    )}
                  </div>
                </div>

                <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-brand-400 transition-colors mt-1 flex-shrink-0" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsCalendarSection;