"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, CalendarDays, AlertCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Events Calendar</h2>
          <p className="text-muted-foreground mt-1">
            Schedule, manage, and promote all student union events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-brand-100 bg-brand-50/30 text-brand-700 text-sm font-semibold">
            {events.length} Total Events
          </Badge>
          <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-all hover:shadow-lg">
            <Link to="/admin/events/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchEvents} className="mt-4 rounded-xl border-brand-100">Try Again</Button>
          </div>
        ) : events.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <CalendarDays className="h-7 w-7 text-brand-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No events scheduled yet</h3>
            <p className="text-muted-foreground">Start by adding a new event to the calendar.</p>
            <Button asChild className="mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-xl">
              <Link to="/admin/events/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={cn(
                  "group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                  "bg-white/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-lg shadow-sm"
                )}
              >
                <div className="flex items-start space-x-5 flex-1 min-w-0">
                  <div className="p-3.5 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex-shrink-0 transition-colors duration-300">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500">
                      <span className="font-medium text-brand-700">{event.category}</span>
                      <span className="text-xs text-muted-foreground italic">• {event.venue}</span>
                      <span className="text-xs text-muted-foreground italic">• {format(new Date(event.startsAt), "MMM dd, yyyy HH:mm")}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {event.rsvpOpen && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[10px] py-0">
                          RSVP Open
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                  <Button asChild variant="outline" className="h-10 px-4 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl shadow-sm">
                    <Link to={`/admin/events/edit/${event.slug}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={deletingId === event.id}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl"
                      >
                        {deletingId === event.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-brand-800">Delete event?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          This will permanently remove <span className="font-semibold text-brand-700">"{event.title}"</span> from the calendar. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl border-brand-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(event.id, event.title)} 
                          className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
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