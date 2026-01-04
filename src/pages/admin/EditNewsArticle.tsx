"use client";

import React, { useEffect, useState } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
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

const EditNewsArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("News article ID is missing.");
        setLoadingArticle(false);
        return;
      }
      try {
        const fetchedArticle = await api.news.getById(id);
        if (fetchedArticle) {
          form.reset({
            title: fetchedArticle.title,
            slug: fetchedArticle.slug,
            excerpt: fetchedArticle.excerpt,
            bodyMd: fetchedArticle.bodyMd,
            tags: fetchedArticle.tags.join(', '),
            publishedAt: new Date(fetchedArticle.publishedAt),
            coverUrl: fetchedArticle.coverUrl,
          });
        } else {
          setError("News article not found.");
        }
      } catch (err) {
        console.error("Failed to fetch news article for editing:", err);
        setError("Failed to load news article. Please try again later.");
      } finally {
        setLoadingArticle(false);
      }
    };
    fetchArticle();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updatedNews = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        bodyMd: values.bodyMd,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        publishedAt: values.publishedAt.toISOString(),
        coverUrl: values.coverUrl,
      };
      await api.news.update(id, updatedNews);
      toast.success("News article updated successfully!");
      navigate("/admin/news");
    } catch (error) {
      console.error("Failed to update news article:", error);
      toast.error("Failed to update news article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-destructive text-lg font-medium">{error}</p>
        <Button asChild variant="outline" className="mt-4 border-brand-500 text-brand-500 hover:bg-brand-50">
          <Link to="/admin/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News Feed
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit News Article | Admin</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Modify Article</h2>
            <p className="text-muted-foreground mt-1">Refine and update existing news for the student community.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
            </Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* 1. Identity Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  General Information
                </div>
                <p className="text-sm text-muted-foreground">The title and slug define how the article appears in the feed and URL.</p>
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
                        <Input placeholder="generated-slug-path" {...field} className="h-10 rounded-xl border-brand-100 bg-slate-50/50 text-slate-500 font-mono text-sm focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Visuals Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <ImageIcon className="h-4 w-4" />
                  Media & Visuals
                </div>
                <p className="text-sm text-muted-foreground">Upload or replace the cover image captured in the news feed.</p>
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NewsImageUpload
                          label="Replace Cover Image"
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

            {/* 3. Content Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <FileText className="h-4 w-4" />
                  Article Content
                </div>
                <p className="text-sm text-muted-foreground">Update the brief hook and the full body story using Markdown.</p>
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

            {/* 4. Metadata Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Tag className="h-4 w-4" />
                  Publishing Details
                </div>
                <p className="text-sm text-muted-foreground">Adjust the publication date and relevant organization tags.</p>
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditNewsArticle;