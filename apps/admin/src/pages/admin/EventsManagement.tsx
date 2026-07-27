"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, CalendarDays, Inbox } from "@/components/ui/font-awesome-icon";
import { api } from "@/lib/api";
import { Event } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.events.getAll();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await api.events.delete(id);
      toast.success(`Event "${title}" deleted successfully!`);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Events
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({events.length})
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Campus timeline & planning</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap">
          <Link to="/events/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Link>
        </Button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[78px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-slate-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchEvents} className="mt-3 rounded-md h-8 text-sm">
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No events scheduled</p>
              <p className="text-xs text-slate-400 mt-0.5">Add your first campus event</p>
            </div>
            <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-8 px-4 text-sm mt-1">
              <Link to="/events/add">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                Add Event
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col sm:flex-row sm:items-center">
                {/* Content */}
                <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                  <div className="w-12 h-12 shrink-0 rounded-md bg-blue-50 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {event.category}
                      </span>
                      {event.rsvpOpen && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-none text-[10px] py-0 h-4">
                          RSVP Open
                        </Badge>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(event.startsAt), "MMM d, yyyy · HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                    {event.venue && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{event.venue}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs"
                  >
                    <Link to={`/events/edit/${event.slug}`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === event.id}
                        className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                      >
                        {deletingId === event.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">Delete event?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          This will permanently remove "{event.title}" from the calendar.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(event.id, event.title)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
                        >
                          Delete Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement;
