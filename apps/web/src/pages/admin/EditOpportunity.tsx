"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Briefcase, CalendarDays, Layout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  deadline: z.date({ required_error: "Deadline date is required." }),
  link: z.string().url({ message: "Link must be a valid URL." }),
  sponsor: z.string().optional().or(z.literal('')),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
});

const EditOpportunity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOpportunity, setLoadingOpportunity] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", deadline: new Date(), link: "", sponsor: "", tags: "", descriptionMd: "" },
  });

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const fetchedOpportunity = await api.opportunities.getById(id);
        if (fetchedOpportunity) {
          form.reset({
            title: fetchedOpportunity.title,
            deadline: new Date(fetchedOpportunity.deadline),
            link: fetchedOpportunity.link,
            sponsor: fetchedOpportunity.sponsor || "",
            tags: fetchedOpportunity.tags.join(', '),
            descriptionMd: fetchedOpportunity.descriptionMd,
          });
        }
      } catch (err) {
        toast.error("Failed to load opportunity.");
      } finally {
        setLoadingOpportunity(false);
      }
    };
    fetchOpportunity();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updatedOpportunity = {
        title: values.title,
        deadline: values.deadline.toISOString(),
        link: values.link,
        sponsor: values.sponsor || undefined,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        descriptionMd: values.descriptionMd,
      };
      await api.opportunities.update(id, updatedOpportunity);
      toast.success("Opportunity updated successfully!");
      navigate("/admin/opportunities");
    } catch (error) {
      toast.error("Failed to update opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingOpportunity) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Opportunity | KWASU SU Admin</title>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Edit Opportunity</h2>
            <p className="text-muted-foreground mt-1">Refine the requirements or details of this listing.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/opportunities">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* 1. Core Details Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Briefcase className="h-4 w-4" />
                  Core Details
                </div>
                <p className="text-sm text-muted-foreground">Primary information about who is offering what.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Opportunity Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google Summer of Code" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Offering Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google Nigeria" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Access Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <CalendarDays className="h-4 w-4" />
                  Timeline & Access
                </div>
                <p className="text-sm text-muted-foreground">Where to apply and when the window closes.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Application Link</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://apply.here.com" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("h-12 pl-3 text-left font-normal rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Select deadline</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-brand-100 shadow-2xl" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-3" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Description Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  Content & Tags
                </div>
                <p className="text-sm text-muted-foreground">Elaborate on the requirements and categorize the listing.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. scholarship, tech, abroad" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Full Description (Markdown)</FormLabel>
                      <FormControl>
                        <MarkdownEditor placeholder="Detail the requirements, benefits, and process..." rows={10} value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex pt-6">
              <Button type="submit" className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Updating...</> : "Update Opportunity"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditOpportunity;