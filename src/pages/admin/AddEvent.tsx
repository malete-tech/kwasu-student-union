"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, ListChecks, Layout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MarkdownEditor from "@/components/MarkdownEditor";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  startsAt: z.date({ required_error: "Start date and time are required." }),
  endsAt: z.date().optional(),
  venue: z.string().min(1, { message: "Venue is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  rsvpOpen: z.boolean().default(false),
  rsvpLink: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  agendaMd: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.endsAt && data.endsAt < data.startsAt) {
    return false;
  }
  return true;
}, {
  message: "End date cannot be before start date.",
  path: ["endsAt"],
});

const AddEvent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      rsvpLink: "",
      agendaMd: "",
    },
  });

  // Auto-generate slug from title
  const title = form.watch("title");
  React.useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      form.setValue("slug", generatedSlug);
    }
  }, [title, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newEvent = {
        title: values.title,
        slug: values.slug,
        startsAt: values.startsAt.toISOString(),
        endsAt: values.endsAt ? values.endsAt.toISOString() : undefined,
        venue: values.venue,
        descriptionMd: values.descriptionMd,
        category: values.category,
        rsvpOpen: values.rsvpOpen,
        rsvpLink: values.rsvpLink || undefined,
        agendaMd: values.agendaMd || undefined,
      };
      await api.events.create(newEvent);
      toast.success("Event added successfully!");
      form.reset();
      navigate("/admin/events");
    } catch (error) {
      console.error("Failed to add event:", error);
      toast.error("Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Event | KWASU SU Admin</title>
        <meta name="description" content="Add a new event to the KWASU Students' Union website." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Schedule New Event</h2>
            <p className="text-muted-foreground mt-1">Create a new event listing for the public calendar.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/events">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events Management
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 rounded-2xl shadow-lg">
            {/* 1. Event Identity Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  Basic Details
                </div>
                <p className="text-sm text-muted-foreground">The title, category, and unique slug for the event.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Freshers' Orientation Day" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="freshers-orientation-day" {...field} className="h-10 rounded-xl border-brand-100 bg-slate-50/50 text-slate-500 font-mono text-sm focus-visible:ring-brand-gold" />
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
                      <FormLabel className="text-slate-700 font-semibold">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm">
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
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Time & Location Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <MapPin className="h-4 w-4" />
                  Time & Venue
                </div>
                <p className="text-sm text-muted-foreground">Specify the exact start/end time and the physical location.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startsAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-semibold">Starts At</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-12 pl-3 text-left font-normal rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm",
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
                          <PopoverContent className="w-auto p-0 rounded-2xl border-brand-100 shadow-2xl" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  // Preserve existing time if available
                                  const newDate = field.value ? new Date(date.setHours(field.value.getHours(), field.value.getMinutes())) : date;
                                  field.onChange(newDate);
                                }
                              }}
                              initialFocus
                              className="p-3"
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
                        <FormLabel className="text-slate-700 font-semibold">Ends At (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-12 pl-3 text-left font-normal rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm",
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
                          <PopoverContent className="w-auto p-0 rounded-2xl border-brand-100 shadow-2xl" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  // Preserve existing time if available
                                  const newDate = field.value ? new Date(date.setHours(field.value.getHours(), field.value.getMinutes())) : date;
                                  field.onChange(newDate);
                                }
                              }}
                              initialFocus
                              className="p-3"
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
                      <FormLabel className="text-slate-700 font-semibold">Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="University Multipurpose Hall" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Content & RSVP Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <ListChecks className="h-4 w-4" />
                  Description & RSVP
                </div>
                <p className="text-sm text-muted-foreground">Provide the full event description and manage registration options.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="descriptionMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Description (Markdown)</FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Detailed description of the event using Markdown..." 
                          rows={8} 
                          value={field.value} 
                          onChange={field.onChange} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agendaMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Agenda (Markdown, Optional)</FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Detailed agenda for the event using Markdown..." 
                          rows={5} 
                          value={field.value || ""} 
                          onChange={field.onChange} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rsvpOpen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-brand-50/50 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-700 font-semibold">
                          RSVP Open
                        </FormLabel>
                        <FormDescription>
                          Check this if students can RSVP for this event.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("rsvpOpen") && (
                  <FormField
                    control={form.control}
                    name="rsvpLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">RSVP Link (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/rsvp" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                        </FormControl>
                        <FormDescription>
                          Provide a direct link for students to RSVP or register for the event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex pt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Scheduling Event...
                  </>
                ) : (
                  "Add Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddEvent;