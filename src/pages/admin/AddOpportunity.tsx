"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Briefcase, CalendarDays, Tag, Link as LinkIcon } from "lucide-react";
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
import MarkdownEditor from "@/components/MarkdownEditor";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  deadline: z.date({ required_error: "Deadline date is required." }),
  link: z.string().url({ message: "Link must be a valid URL." }),
  sponsor: z.string().optional().or(z.literal('')),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
});

const AddOpportunity: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      deadline: new Date(),
      link: "",
      sponsor: "",
      tags: "",
      descriptionMd: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newOpportunity = {
        title: values.title,
        deadline: values.deadline.toISOString(),
        link: values.link,
        sponsor: values.sponsor || undefined,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        descriptionMd: values.descriptionMd,
      };
      await api.opportunities.create(newOpportunity);
      toast.success("Opportunity added successfully!");
      form.reset();
      navigate("/admin/opportunities");
    } catch (error) {
      console.error("Failed to add opportunity:", error);
      toast.error("Failed to add opportunity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Opportunity | KWASU SU Admin</title>
        <meta name="description" content="Add a new student opportunity (scholarship, internship, job) to the website." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Add New Opportunity</h2>
            <p className="text-muted-foreground mt-1">Create a new listing for scholarships, internships, or jobs.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/opportunities">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities Management
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 rounded-2xl shadow-lg">
            {/* 1. Basic Details Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Briefcase className="h-4 w-4" />
                  Opportunity Details
                </div>
                <p className="text-sm text-muted-foreground">Provide the core information about the opportunity.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Shell Undergraduate Scholarship" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sponsor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Sponsor/Organization (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Shell Nigeria" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Application & Deadline Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <CalendarDays className="h-4 w-4" />
                  Timeline & Link
                </div>
                <p className="text-sm text-muted-foreground">Set the application deadline and provide the direct link.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Application Link</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://apply.example.com" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-700 font-semibold">Deadline Date</FormLabel>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-brand-100 shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Description & Tags Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Tag className="h-4 w-4" />
                  Content & Categorization
                </div>
                <p className="text-sm text-muted-foreground">Write a detailed description and add relevant tags (e.g., scholarship, internship).</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="scholarship, academic, engineering" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
                      </FormControl>
                      <FormDescription>
                        Use tags like 'scholarship', 'internship', 'job', 'grant'.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descriptionMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Description (Markdown)</FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Detailed description of the opportunity using Markdown..." 
                          rows={10} 
                          value={field.value} 
                          onChange={field.onChange} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    Adding Opportunity...
                  </>
                ) : (
                  "Add Opportunity"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddOpportunity;