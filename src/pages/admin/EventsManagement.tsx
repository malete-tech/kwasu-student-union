"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, CalendarDays } from "lucide-react";
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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.events.delete(id);
      toast.success("Event deleted successfully!");
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-700">Events Management</h2>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <Link to="/admin/events/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-center text-lg">{error}</div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events found. Start by adding a new one!</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-2 rounded-full bg-brand-100 text-brand-700 flex-shrink-0">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 max-w-full"> {/* Added max-w-full here */}
                      <h3 className="font-semibold text-brand-800 truncate">{event.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {format(new Date(event.startsAt), "MMM dd, yyyy HH:mm")}
                        {event.endsAt &&
                          ` - ${
                            format(new Date(event.startsAt), "yyyy-MM-dd") === format(new Date(event.endsAt), "yyyy-MM-dd")
                              ? format(new Date(event.endsAt), "HH:mm")
                              : format(new Date(event.endsAt), "MMM dd, yyyy HH:mm")
                          }`}
                      </p>
                      <Badge variant="secondary" className="mt-1 bg-brand-100 text-brand-700 flex-shrink-0">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <Link to={`/admin/events/edit/${event.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={deletingId === event.id}>
                          {deletingId === event.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event
                            "{event.title}" from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(event.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManagement;