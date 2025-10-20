"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
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
import { CalendarIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";
import { toast } from "sonner";
// import ImageUpload from "@/components/ImageUpload"; // Removed
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// import { News } from "@/types"; // Removed unused import
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  excerpt: z.string().min(1, { message: "Excerpt is required." }),
  bodyMd: z.string().min(1, { message: "Body content is required." }),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  publishedAt: z.date({ required_error: "Published date is required." }),
  // coverUrl: z.string().optional(), // Removed
});

const EditNewsArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [articleId, setArticleId] = useState<string | null>(null);
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
      // coverUrl: undefined, // Removed
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError("News article slug is missing.");
        setLoadingArticle(false);
        return;
      }
      try {
        const fetchedArticle = await api.news.getBySlug(slug);
        if (fetchedArticle) {
          setArticleId(fetchedArticle.id);
          form.reset({
            title: fetchedArticle.title,
            slug: fetchedArticle.slug,
            excerpt: fetchedArticle.excerpt,
            bodyMd: fetchedArticle.bodyMd,
            tags: fetchedArticle.tags.join(', '),
            publishedAt: new Date(fetchedArticle.publishedAt),
            // coverUrl: fetchedArticle.coverUrl, // Removed
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
  }, [slug, form]);

  // Auto-generate slug from title if it's a new article or slug hasn't been manually edited
  const title = form.watch("title");
  const currentSlug = form.watch("slug");
  const isSlugDirty = form.formState.dirtyFields.slug;

  React.useEffect(() => {
    if (title && !isSlugDirty) { // Only auto-generate if slug hasn't been manually touched
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
      if (generatedSlug !== currentSlug) {
        form.setValue("slug", generatedSlug, { shouldDirty: false }); // Don't mark as dirty if auto-generated
      }
    }
  }, [title, form, isSlugDirty, currentSlug]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!articleId) {
      toast.error("Cannot update: Article ID is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedNews = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        bodyMd: values.bodyMd,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        publishedAt: values.publishedAt.toISOString(),
        // coverUrl: values.coverUrl, // Removed
      };
      await api.news.update(articleId, updatedNews);
      toast.success("News article updated successfully!");
      navigate("/admin/news"); // Navigate back to news management list
    } catch (error) {
      console.error("Failed to update news article:", error);
      toast.error("Failed to update news article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingArticle) {
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
        <h2 className="text-3xl font-bold text-brand-700">Edit News Article</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/news">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to News Management
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
        <title>Edit News Article | KWASU SU Admin</title>
        <meta name="description" content="Edit an existing news article on the KWASU Students' Union website." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Edit News Article</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Edit News Article Details</CardTitle>
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
                        <Input placeholder="KWASU SU Elections 2024" {...field} className="focus-visible:ring-brand-gold" />
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
                        <Input placeholder="kwasu-su-elections-2024" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short summary of the news article..." rows={3} {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Body (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write your news article content here using Markdown..." rows={10} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="elections, academic, announcement" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Published Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal focus-visible:ring-brand-gold",
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Removed ImageUpload component */}
                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Article...
                    </>
                  ) : (
                    "Update News Article"
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

export default EditNewsArticle;