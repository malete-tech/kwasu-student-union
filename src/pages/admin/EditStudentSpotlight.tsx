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

const EditStudentSpotlight: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSpotlight, setLoadingSpotlight] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchSpotlight = async () => {
      if (!id) {
        setError("Spotlight ID is missing.");
        setLoadingSpotlight(false);
        return;
      }
      try {
        const fetchedSpotlight = await api.studentSpotlight.getById(id);
        if (fetchedSpotlight) {
          form.reset({
            name: fetchedSpotlight.name,
            achievement: fetchedSpotlight.achievement,
            descriptionMd: fetchedSpotlight.descriptionMd,
            photoUrl: fetchedSpotlight.photoUrl || undefined,
            link: fetchedSpotlight.link || "",
          });
        } else {
          setError("Student spotlight not found.");
        }
      } catch (err) {
        console.error("Failed to fetch student spotlight for editing:", err);
        setError("Failed to load student spotlight. Please try again later.");
      } finally {
        setLoadingSpotlight(false);
      }
    };
    fetchSpotlight();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) {
      toast.error("Cannot update: Spotlight ID is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedSpotlight = {
        name: values.name,
        achievement: values.achievement,
        descriptionMd: values.descriptionMd,
        photoUrl: values.photoUrl || undefined,
        link: values.link || undefined,
      };
      await api.studentSpotlight.update(id, updatedSpotlight);
      toast.success("Student spotlight updated successfully!");
      navigate("/admin/spotlight");
    } catch (error) {
      console.error("Failed to update student spotlight:", error);
      toast.error("Failed to update student spotlight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSpotlight) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <Card className="shadow-lg rounded-xl p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
        <h2 className="text-3xl font-bold text-brand-700">Edit Student Spotlight</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/spotlight">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Spotlight Management
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
        <title>Edit Student Spotlight | KWASU SU Admin</title>
        <meta name="description" content="Edit an existing student spotlight entry on the KWASU Students' Union website." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Edit Student Spotlight</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/spotlight">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Spotlight Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Edit Spotlight Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Aisha Bello" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Achievement</FormLabel>
                      <FormControl>
                        <Input placeholder="Developed an award-winning campus navigation app." {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Description (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the student's achievement using Markdown..." rows={5} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
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
                      <FormLabel>External Link (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/story" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormDescription>
                        Provide a link to a full story or profile related to this spotlight.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting || !form.formState.isValid}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Spotlight...
                    </>
                  ) : (
                    "Update Student Spotlight"
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

export default EditStudentSpotlight;