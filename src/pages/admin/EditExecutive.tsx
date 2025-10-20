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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  role: z.string().min(1, { message: "Role is required." }),
  faculty: z.string().optional(),
  tenureStart: z.date({ required_error: "Tenure start date is required." }),
  tenureEnd: z.date({ required_error: "Tenure end date is required." }),
  photoUrl: z.string().optional(),
  bioMd: z.string().min(1, { message: "Biography is required." }),
  manifestoMd: z.string().min(1, { message: "Manifesto is required." }),
  projectsMd: z.string().optional(),
  contactEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  contactTwitter: z.string().optional().or(z.literal('')),
  contactInstagram: z.string().optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
});

const EditExecutive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingExecutive, setLoadingExecutive] = useState(true);
  const [executiveId, setExecutiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      role: "",
      faculty: "",
      tenureStart: new Date(),
      tenureEnd: new Date(),
      photoUrl: undefined,
      bioMd: "",
      manifestoMd: "",
      projectsMd: "",
      contactEmail: "",
      contactTwitter: "",
      contactInstagram: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    const fetchExecutive = async () => {
      if (!slug) {
        setError("Executive slug is missing.");
        setLoadingExecutive(false);
        return;
      }
      try {
        const fetchedExecutive = await api.executives.getBySlug(slug);
        if (fetchedExecutive) {
          setExecutiveId(fetchedExecutive.id);
          form.reset({
            name: fetchedExecutive.name,
            slug: fetchedExecutive.slug,
            role: fetchedExecutive.role,
            faculty: fetchedExecutive.faculty || "",
            tenureStart: new Date(fetchedExecutive.tenureStart),
            tenureEnd: new Date(fetchedExecutive.tenureEnd),
            photoUrl: fetchedExecutive.photoUrl || undefined,
            bioMd: fetchedExecutive.bioMd,
            manifestoMd: fetchedExecutive.manifestoMd,
            projectsMd: fetchedExecutive.projectsMd || undefined,
            contactEmail: fetchedExecutive.contacts?.email || "",
            contactTwitter: fetchedExecutive.contacts?.twitter || "",
            contactInstagram: fetchedExecutive.contacts?.instagram || "",
            contactPhone: fetchedExecutive.contacts?.phone || "",
          });
        } else {
          setError("Executive not found.");
        }
      } catch (err) {
        console.error("Failed to fetch executive for editing:", err);
        setError("Failed to load executive. Please try again later.");
      } finally {
        setLoadingExecutive(false);
      }
    };
    fetchExecutive();
  }, [slug, form]);

  // Auto-generate slug from name if it's a new executive or slug hasn't been manually edited
  const name = form.watch("name");
  const currentSlug = form.watch("slug");
  const isSlugDirty = form.formState.dirtyFields.slug;

  React.useEffect(() => {
    if (name && !isSlugDirty) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      if (generatedSlug !== currentSlug) {
        form.setValue("slug", generatedSlug, { shouldDirty: false });
      }
    }
  }, [name, form, isSlugDirty, currentSlug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!executiveId) {
      toast.error("Cannot update: Executive ID is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedExecutive = {
        name: values.name,
        slug: values.slug,
        role: values.role,
        faculty: values.faculty || undefined, // Changed from null to undefined
        tenureStart: values.tenureStart.toISOString().split('T')[0],
        tenureEnd: values.tenureEnd.toISOString().split('T')[0],
        photoUrl: values.photoUrl || undefined, // Changed from null to undefined
        bioMd: values.bioMd,
        manifestoMd: values.manifestoMd,
        projectsMd: values.projectsMd || undefined, // Changed from null to undefined
        contacts: {
          email: values.contactEmail || undefined, // Changed from null to undefined
          twitter: values.contactTwitter || undefined, // Changed from null to undefined
          instagram: values.contactInstagram || undefined, // Changed from null to undefined
          phone: values.contactPhone || undefined, // Changed from null to undefined
        },
      };
      await api.executives.update(executiveId, updatedExecutive);
      toast.success("Executive profile updated successfully!");
      navigate("/admin/executives");
    } catch (error) {
      console.error("Failed to update executive profile:", error);
      toast.error("Failed to update executive profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingExecutive) {
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
        <h2 className="text-3xl font-bold text-brand-700">Edit Executive Profile</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/executives">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives Management
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
        <title>Edit Executive Profile | KWASU SU Admin</title>
        <meta name="description" content="Edit an existing executive profile on the KWASU Students' Union website." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Edit Executive Profile</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/executives">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Edit Executive Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="focus-visible:ring-brand-gold" />
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
                        <Input placeholder="john-doe-president" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="President" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Social Sciences" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenureStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tenure Start Date</FormLabel>
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
                    name="tenureEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tenure End Date</FormLabel>
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
                </div>
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          label="Upload Executive Photo"
                          bucketName="executive-photos"
                          folderPath="public"
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
                  name="bioMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biography (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write a short biography using Markdown..." rows={5} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manifestoMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manifesto (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Outline the executive's manifesto using Markdown..." rows={7} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectsMd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Projects (Markdown, Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List key projects using Markdown..." rows={5} {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3 className="text-lg font-semibold text-brand-700 mt-8 mb-4">Contact Information (Optional)</h3>
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="executive@kwasusu.edu" {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactTwitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe_kwasu" {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInstagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</Label>
                    <FormControl>
                      <Input placeholder="johndoe_kwasu" {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+2348012345678" {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Executive...
                  </>
                ) : (
                  "Update Executive Profile"
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

export default EditExecutive;