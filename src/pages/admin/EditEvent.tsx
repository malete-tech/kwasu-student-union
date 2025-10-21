"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  startsAt: z.date({ required_error: "Start date and time are required." }),
  endsAt: z.date().optional(),
  venue: z.string().min(1, { message: "Venue is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  rsvpOpen: z.boolean().default(false),
  agendaMd: z.string().optional(),
}).refine((data) => {
  if (data.endsAt && data.endsAt < data.startsAt) {
    return false;
  }
  return true;
}, {
  message: "End date cannot be before start date.",
  path: ["endsAt"],
});

const EditEvent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      startsAt: new Date(),
      endsAt: undefined,
      venue: "",
      descriptionMd: "",
      category: "",
      rsvpOpen: false,
      agendaMd: "",
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) {
        setError("Event slug is missing.");
        setLoadingEvent(false);
        return;
      }
      try {
        const fetchedEvent = await api.events.getBySlug(slug);
        if (fetchedEvent) {
          setEventId(fetchedEvent.id);
          form.reset({
            title: fetchedEvent.title,
            slug: fetchedEvent.slug,
            startsAt: new Date(fetchedEvent.startsAt),
            endsAt: fetchedEvent.endsAt ? new Date(fetchedEvent.endsAt) : undefined,
            venue: fetchedEvent.venue,
            descriptionMd: fetchedEvent.descriptionMd,
            category: fetchedEvent.category,
            rsvpOpen: fetchedEvent.rsvpOpen,
            agendaMd: fetchedEvent.agendaMd || "",
          });
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("Failed to fetch event for editing:", err);
        setError("Failed to load event. Please try again later.");
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [slug, form]);

  // Auto-generate slug from title if it's a new event or slug hasn't been manually edited
  const title = form.watch("title");
  const currentSlug = form.watch("slug");
  const isSlugDirty = form.formState.dirtyFields.slug;

  React.useEffect(() => {
    if (title && !isSlugDirty) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      if (generatedSlug !== currentSlug) {
        form.setValue("slug", generatedSlug, { shouldDirty: false });
      }
    }
  }, [title, form, isSlugDirty, currentSlug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!eventId) {
      toast.error("Cannot update: Event ID is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedEvent = {
        title: values.title,
        slug: values.slug,
        startsAt: values.startsAt.toISOString(),
        endsAt: values.endsAt ? values.endsAt.toISOString() : undefined,
        venue: values.venue,
        descriptionMd: values.descriptionMd,
        category: values.category,
        rsvpOpen: values.rsvpOpen,
        agendaMd: values.agendaMd || undefined,
      };
      await api.events.update(eventId, updatedEvent);
      toast.success("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Card className="shadow-lg rounded-xl p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-brand-700">Edit Event</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/events">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Event | KWASU SU Admin</title>
        <meta name="description" content="Edit an existing event on the KWASU Students' Union website." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Edit Event</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/events">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Edit Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Freshers' Orientation Day" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="freshers-orientation-day" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startsAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Starts At</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal focus-visible:ring-brand-gold",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP HH:mm")
                                ) : (
                                  <span>Pick date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  const existingTime = field.value ? { hours: field.value.getHours(), minutes: field.value.getMinutes() } : { hours: 0, minutes: 0 };
                                  date.setHours(existingTime.hours, existingTime.minutes);
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                value={field.value ? format(field.value, "HH:mm") : "00:00"}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  if (field.value) {
                                    const newDate = new Date(field.value);
                                    newDate.setHours(hours!, minutes!);
                                    field.onChange(newDate);
                                  } else {
                                    const newDate = new Date();
                                    newDate.setHours(hours!, minutes!);
                                    field.onChange(newDate);
                                  }
                                }}
                                className="focus-visible:ring-brand-gold"
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endsAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ends At (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal focus-visible:ring-brand-gold",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP HH:mm")
                                ) : (
                                  <span>Pick date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  const existingTime = field.value ? { hours: field.value.getHours(), minutes: field.value.getMinutes() } : { hours: 0, minutes: 0 };
                                  date.setHours(existingTime.hours, existingTime.minutes);
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t">
                              <Input
                                type="time"
                                value={field.value ? format(field.value, "HH:mm") : "00:00"}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  if (field.value) {
                                    const newDate = new Date(field.value);
                                    newDate.setHours(hours!, minutes!);
                                    field.onChange(newDate);
                                  } else {
                                    const newDate = new Date();
                                    newDate.setHours(hours!, minutes!);
                                    field.onChange(newDate);
                                  }
                                }}
                                className="focus-visible:ring-brand-gold"
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="University Multipurpose Hall" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descriptionMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the event using Markdown..." rows={8} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-brand-gold">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Welfare">Welfare</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rsvpOpen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          RSVP Open
                        </FormLabel>
                        <FormDescription>
                          Check this if students can RSVP for this event.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agendaMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agenda (Markdown, Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed agenda for the event using Markdown..." rows={5} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Event...
                    </>
                  ) : (
                    "Update Event"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditEvent;