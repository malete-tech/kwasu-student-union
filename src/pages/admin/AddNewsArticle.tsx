"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileText, Image as ImageIcon, Calendar as CalendarIcon, Tag, Layout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NewsImageUpload from "@/components/NewsImageUpload";
import MarkdownEditor from "@/components/MarkdownEditor";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  excerpt: z.string().min(1, { message: "Excerpt is required." }),
  bodyMd: z.string().min(1, { message: "Body content is required." }),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  publishedAt: z.date({ required_error: "Published date is required." }),
  coverUrl: z.string().optional(),
});

const AddNewsArticle: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      bodyMd: "",
      tags: "",
      publishedAt: new Date(),
      coverUrl: undefined,
    },
  });

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
      const newNews = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        bodyMd: values.bodyMd,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        publishedAt: values.publishedAt.toISOString(),
        coverUrl: values.coverUrl,
      };
      await api.news.create(newNews);
      toast.success("News article added successfully!");
      navigate("/admin/news");
    } catch (error) {
      console.error("Failed to add news article:", error);
      toast.error("Failed to add news article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add News Article | KWASU SU Admin</title>
        <meta name="description" content="Add a new news article to the KWASU Students' Union website." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Compose News</h2>
            <p className="text-muted-foreground mt-1">Draft and publish a new announcement for the student community.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News Feed
            </Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Header Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  General Information
                </div>
                <p className="text-sm text-muted-foreground">The title and slug will define how the article appears in the feed and URL.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a catchy headline..." {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
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
                        <Input placeholder="auto-generated-slug" {...field} className="h-10 rounded-xl border-brand-100 bg-slate-50/50 text-slate-500 font-mono text-sm focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Visuals Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <ImageIcon className="h-4 w-4" />
                  Media & Visuals
                </div>
                <p className="text-sm text-muted-foreground">Upload a cover image that captures attention in the news list.</p>
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NewsImageUpload
                          label="Upload Cover Image"
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

            <hr className="border-slate-100" />

            {/* Content Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <FileText className="h-4 w-4" />
                  Article Content
                </div>
                <p className="text-sm text-muted-foreground">Provide a short summary and the full body of your article using Markdown.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Summary Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief hook to engage readers..." rows={3} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bodyMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Body (Markdown)</FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Tell your story here..." 
                          rows={15} 
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

            <hr className="border-slate-100" />

            {/* Metadata Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Tag className="h-4 w-4" />
                  Publishing Details
                </div>
                <p className="text-sm text-muted-foreground">Set the publication date and relevant tags for categorization.</p>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel className="text-slate-700 font-semibold">Release Date</FormLabel>
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
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-slate-700 font-semibold">Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. academic, events, notice" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold focus-visible:bg-white transition-all shadow-sm" />
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
                    Publishing...
                  </>
                ) : (
                  "Publish Article"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddNewsArticle;