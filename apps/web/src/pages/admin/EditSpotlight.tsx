"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Star, Image as ImageIcon, Layout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  achievement: z.string().min(1, { message: "Achievement is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
  photoUrl: z.string().optional(),
  link: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
});

const EditSpotlight: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSpotlight, setLoadingSpotlight] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", achievement: "", descriptionMd: "", photoUrl: undefined, link: "" },
  });

  useEffect(() => {
    const fetchSpotlight = async () => {
      if (!id) return;
      try {
        const fetchedSpotlight = await api.spotlight.getById(id);
        if (fetchedSpotlight) {
          form.reset({
            name: fetchedSpotlight.name,
            achievement: fetchedSpotlight.achievement,
            descriptionMd: fetchedSpotlight.descriptionMd,
            photoUrl: fetchedSpotlight.photoUrl || undefined,
            link: fetchedSpotlight.link || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load spotlight entry.");
      } finally {
        setLoadingSpotlight(false);
      }
    };
    fetchSpotlight();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updatedSpotlight = {
        name: values.name,
        achievement: values.achievement,
        descriptionMd: values.descriptionMd,
        photoUrl: values.photoUrl || undefined,
        link: values.link || undefined,
      };
      await api.spotlight.update(id, updatedSpotlight);
      toast.success("Spotlight updated successfully!");
      navigate("/admin/spotlight");
    } catch (error) {
      toast.error("Failed to update spotlight.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSpotlight) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Spotlight | KWASU SU Admin</title>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Edit Spotlight</h2>
            <p className="text-muted-foreground mt-1">Refine the success story or update the student's portrait.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/spotlight">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* 1. Profile Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Star className="h-4 w-4" />
                  Student Info
                </div>
                <p className="text-sm text-muted-foreground">Who are we celebrating and what have they done?</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Aisha Bello" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="achievement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Core Achievement</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Developed a campus app" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Visuals & Link Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <ImageIcon className="h-4 w-4" />
                  Media & Link
                </div>
                <p className="text-sm text-muted-foreground">Provide a visual and optionally link to a full feature.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Student Portrait</FormLabel>
                      <FormControl>
                        <ImageUpload label="Upload Photo" bucketName="student-spotlight-photos" folderPath="public" value={field.value} onChange={field.onChange} disabled={isSubmitting} />
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
                      <FormLabel className="text-slate-700 font-semibold">External Story Link (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://..." {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Narrative Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  Achievement Narrative
                </div>
                <p className="text-sm text-muted-foreground">The full story of the student's success.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="descriptionMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">The Story (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share the detailed success story..." rows={8} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex pt-6">
              <Button type="submit" className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Updating...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditSpotlight;