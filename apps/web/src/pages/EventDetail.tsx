"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  ExternalLink,
} from "@/components/ui/font-awesome-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import FadeIn from "@/components/FadeIn";

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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Helmet><title>Loading… | KWASU SU</title></Helmet>
        <div className="w-full bg-brand-900 py-12 md:py-16">
          <div className="container">
            <Skeleton className="h-3 w-28 mb-5 bg-brand-700" />
            <Skeleton className="h-8 w-3/4 mb-3 bg-brand-700" />
            <div className="flex gap-6 mt-5">
              <Skeleton className="h-3 w-32 bg-brand-700" />
              <Skeleton className="h-3 w-24 bg-brand-700" />
              <Skeleton className="h-3 w-28 bg-brand-700" />
            </div>
          </div>
        </div>
        <div className="container py-10 space-y-3 max-w-3xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </>
    );
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (error || !event) {
    return (
      <div className="container py-20 text-center">
        <p className="text-sm text-red-500 mb-6">
          {error || "Event data is not available."}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-brand-300 text-brand-600 hover:bg-brand-50 text-xs font-bold uppercase tracking-wider rounded"
        >
          <Link to="/events">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  const startDate = new Date(event.startsAt);
  const endDate = event.endsAt ? new Date(event.endsAt) : null;
  const isSameDay =
    endDate && format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");

  // ── Article ──────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title={`${event.title} | KWASU Students' Union Events`}
        description={event.descriptionMd.replace(/[#*`_>]/g, "").split("\n")[0] ?? event.title}
        image="https://kwasusu.com.ng/logo.png"
        url={`https://kwasusu.com.ng/events/${event.slug}`}
        type="event"
      />

      {/* ── EVENT BANNER ─────────────────────────────────────────────────── */}
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

        <div className="container relative py-10 md:py-14">
          {/* Breadcrumb back link */}
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-200 text-xs font-bold uppercase tracking-[0.12em] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Campus Events
          </Link>

          <div className="max-w-3xl">
            {/* Category tag */}
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gold bg-brand-800 px-2.5 py-1 rounded mb-4">
              {event.category}
            </span>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-6">
              {event.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5 text-brand-300 text-xs font-medium">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                  {format(startDate, "dd MMMM yyyy")}
                  {endDate && !isSameDay ? ` – ${format(endDate, "dd MMMM yyyy")}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-300 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {format(startDate, "p")}
                  {endDate && isSameDay ? ` – ${format(endDate, "p")}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-300 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* RSVP action */}
            {event.rsvpOpen && event.rsvpLink && (
              <a
                href={event.rsvpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-brand-gold hover:bg-brand-gold/90 text-brand-900 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
              >
                RSVP Now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── EVENT BODY ───────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="container py-10 pb-16">
          <div className="max-w-3xl">
            {/* Description */}
            <div className="prose prose-slate prose-base md:prose-lg max-w-none break-words
              prose-headings:text-brand-900 prose-headings:font-bold
              prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-brand-800
              prose-blockquote:border-l-brand-400 prose-blockquote:text-gray-600
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {event.descriptionMd}
              </ReactMarkdown>
            </div>

            {/* Agenda block */}
            {event.agendaMd && (
              <div className="mt-10 border-l-2 border-brand-500 pl-5">
                <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-4">
                  Agenda
                </p>
                <div className="prose prose-slate prose-sm max-w-none
                  prose-headings:text-brand-900 prose-headings:font-semibold
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {event.agendaMd}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </>
  );
};

export default EventDetail;