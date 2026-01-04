"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Star, Image as ImageIcon, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  achievement: z.string().min(1, { message: "Achievement is required." }),
  descriptionMd: z.string().min(1, { message: "Description is required." }),
  photoUrl: z.string().optional(),
  link: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
});

const AddSpotlight: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      achievement: "",
      descriptionMd: "",
      photoUrl: undefined,
      link: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newSpotlight = {
        name: values.name,
        achievement: values.achievement,
        descriptionMd: values.descriptionMd,
        photoUrl: values.photoUrl || undefined,
        link: values.link || undefined,
      };
      await api.spotlight.create(newSpotlight);
      toast.success("Spotlight entry added successfully!");
      form.reset();
      navigate("/admin/spotlight");
    } catch (error) {
      console.error("Failed to add spotlight entry:", error);
      toast.error("Failed to add spotlight entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Spotlight | KWASU SU Admin</title>
        <meta name="description" content="Add a new spotlight entry to the KWASU Students' Union website." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Add New Spotlight</h2>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/spotlight">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Spotlight Management
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 rounded-2xl shadow-lg">
            {/* 1. Student Details Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Star className="h-4 w-4" />
                  Student Information
                </div>
                <p className="text-sm text-muted-foreground">Enter the student's name and their key achievement.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Aisha Bello" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Achievement</FormLabel>
                      <FormControl>
                        <Input placeholder="Developed an award-winning campus navigation app." {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Content Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <FileText className="h-4 w-4" />
                  Story Content
                </div>
                <p className="text-sm text-muted-foreground">Write the detailed description of the achievement.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="descriptionMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Description (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the student's achievement using Markdown..." rows={8} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Media & Link Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <ImageIcon className="h-4 w-4" />
                  Media & Link
                </div>
                <p className="text-sm text-muted-foreground">Upload a photo and optionally link to a full story.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Photo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          label="Upload Student Photo"
                          bucketName="student-spotlight-photos"
                          folderPath="public"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a photo of the student for the spotlight.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">External Link (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/story" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormDescription>
                        Provide a link to a full story or profile related to this spotlight.
                      </FormDescription>
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
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Adding Spotlight...
                  </>
                ) : (
                  "Add Spotlight"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddSpotlight;