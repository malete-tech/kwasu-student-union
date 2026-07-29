"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Event } from "@/types";
import { format } from "date-fns";
import { MapPin, CalendarDays, ExternalLink } from "@/components/ui/font-awesome-icon";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const startDate = new Date(event.startsAt);
  const endDate = event.endsAt ? new Date(event.endsAt) : null;

  return (
    <div
      className={cn(
        "flex flex-col border border-gray-100 rounded bg-white hover:border-brand-200 hover:shadow-sm transition-all duration-150",
        className
      )}
    >
      {/* Card body */}
      <div className="flex-1 p-4">
        {/* Category + RSVP status row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
            {event.category}
          </span>
          {event.rsvpOpen && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
              RSVP Open
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-brand-900 leading-snug line-clamp-2 mb-3">
          <Link
            to={`/events/${event.slug}`}
            className="hover:text-brand-600 transition-colors focus-visible:ring-brand-gold focus-visible:ring-2 focus-visible:ring-offset-2 rounded outline-none"
          >
            {event.title}
          </Link>
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <CalendarDays className="h-3.5 w-3.5 text-brand-400 flex-shrink-0" />
            <span>
              {format(startDate, "MMM dd, yyyy")}
              {endDate &&
              format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd")
                ? ` – ${format(endDate, "MMM dd, yyyy")}`
                : ` at ${format(startDate, "p")}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {event.descriptionMd.split("\n")[0]}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link
          to={`/events/${event.slug}`}
          className="text-[11px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider transition-colors"
        >
          View Details
        </Link>

        {event.rsvpOpen && event.rsvpLink && (
          <a
            href={event.rsvpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-900 bg-brand-gold hover:bg-brand-gold/90 px-3 py-1 rounded transition-colors"
          >
            RSVP <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;