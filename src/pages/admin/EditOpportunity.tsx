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
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) {
        setError("Opportunity ID is missing.");
        setLoadingOpportunity(false);
        return;
      }
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
        } else {
          setError("Opportunity not found.");
        }
      } catch (err) {
        console.error("Failed to fetch opportunity for editing:", err);
        setError("Failed to load opportunity. Please try again later.");
      } finally {
        setLoadingOpportunity(false);
      }
    };
    fetchOpportunity();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) {
      toast.error("Cannot update: Opportunity ID is missing.");
      return;
    }
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
      console.error("Failed to update opportunity:", error);
      toast.error("Failed to update opportunity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingOpportunity) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Card className="shadow-lg rounded-xl p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-brand-700">Edit Opportunity</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/opportunities">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities Management
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
        <title>Edit Opportunity | KWASU SU Admin</title>
        <meta name="description" content="Edit an existing student opportunity." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Edit Opportunity</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/opportunities">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Edit Opportunity Details</CardTitle>
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
                        <Input placeholder="Shell Undergraduate Scholarship" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Link</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://apply.example.com" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Sponsor/Organization (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Shell Nigeria" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Deadline Date</FormLabel>
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
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="scholarship, academic, engineering" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Description (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the opportunity using Markdown..." rows={8} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Opportunity...
                    </>
                  ) : (
                    "Update Opportunity"
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

export default EditOpportunity;