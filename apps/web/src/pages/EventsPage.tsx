"use client";

import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { Event } from "@/types";
import EventCard from "@/components/event-card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Search } from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AdPlacement from "@/components/AdPlacement";
import FadeIn from "@/components/FadeIn";

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
        const sorted = data.sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );
        setAllEvents(sorted);
        setFilteredEvents(sorted);
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
    let current = allEvents;

    if (selectedDate) {
      current = current.filter((event) => {
        const start = new Date(event.startsAt);
        const end = event.endsAt ? new Date(event.endsAt) : start;
        return (
          selectedDate.toDateString() >= start.toDateString() &&
          selectedDate.toDateString() <= end.toDateString()
        );
      });
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      current = current.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.descriptionMd.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    setFilteredEvents(
      current.sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      )
    );
  }, [searchTerm, selectedDate, allEvents]);

  const isFiltering = !!searchTerm || !!selectedDate;

  const modifiers = { hasEvent: allEvents.map((e) => new Date(e.startsAt)) };
  const modifiersClassNames = { hasEvent: "bg-brand-500 text-white rounded-full" };

  return (
    <>
      <SEO
        title="Campus Events Calendar | KWASU Students' Union"
        description="Discover upcoming Kwara State University campus events, workshops, union meetings, and student activities."
        url="https://kwasusu.com.ng/events"
      />

      {/* ── PAGE BANNER ───────────────────────────────────────────────────── */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

        <div className="container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              KWASU Students' Union
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Campus{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Events
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Academic summits, cultural celebrations, and community gatherings —
              everything happening across KWASU.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Sidebar: calendar + ad ─────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-gray-100 rounded p-4 bg-white">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-4">
                Filter by Date
              </p>
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
                className="mt-3 w-full h-8 rounded border-gray-200 text-brand-600 hover:bg-brand-50 text-xs font-bold uppercase tracking-wider"
              >
                Clear Selection
              </Button>
            </div>

            <AdPlacement placement="events_feed" />
          </div>

          {/* ── Main: search + event grid ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, venue, or category…"
                className="h-9 pl-10 text-sm rounded border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-gray-100 rounded p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-full mt-2" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-center text-sm text-red-500">{error}</div>
            ) : filteredEvents.length > 0 ? (
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((eventItem) => (
                    <EventCard key={eventItem.id} event={eventItem} className="h-full" />
                  ))}
                </div>
              </FadeIn>
            ) : (
              <div className="py-20 flex flex-col items-center text-center">
                <i className="fa-solid fa-calendar-xmark text-4xl text-gray-200 mb-4" />
                <p className="text-sm font-semibold text-gray-500 mb-1">No events found</p>
                <p className="text-xs text-gray-400 mb-5">
                  {isFiltering
                    ? "Try a different search term or pick another date."
                    : "No events have been scheduled yet."}
                </p>
                {isFiltering && (
                  <button
                    onClick={() => { setSearchTerm(""); setSelectedDate(undefined); }}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                  >
                    Clear filters
                  </button>
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