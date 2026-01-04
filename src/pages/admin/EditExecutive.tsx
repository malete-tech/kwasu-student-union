"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CalendarDays, Mail, Layout } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Executive } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const councilTypes: Executive['councilType'][] = ['Central', 'Senate', 'Judiciary'];

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slug: z.string().min(1, { message: "Slug is required." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase, alphanumeric, and use hyphens for spaces." }),
  role: z.string().min(1, { message: "Role is required." }),
  councilType: z.enum(['Central', 'Senate', 'Judiciary'], { required_error: "Council type is required." }),
  faculty: z.string().optional().or(z.literal('')),
  tenureStart: z.date({ required_error: "Tenure start date is required." }),
  tenureEnd: z.date({ required_error: "Tenure end date is required." }),
  photoUrl: z.string().optional(),
  projectsMd: z.string().optional().or(z.literal('')),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      role: "",
      councilType: 'Central',
      faculty: "",
      tenureStart: new Date(),
      tenureEnd: new Date(),
      photoUrl: undefined,
      projectsMd: "",
      contactEmail: "",
      contactTwitter: "",
      contactInstagram: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    const fetchExecutive = async () => {
      if (!slug) return;
      try {
        const fetchedExecutive = await api.executives.getBySlug(slug);
        if (fetchedExecutive) {
          setExecutiveId(fetchedExecutive.id);
          form.reset({
            name: fetchedExecutive.name,
            slug: fetchedExecutive.slug,
            role: fetchedExecutive.role,
            councilType: fetchedExecutive.councilType,
            faculty: fetchedExecutive.faculty || "",
            tenureStart: new Date(fetchedExecutive.tenureStart),
            tenureEnd: new Date(fetchedExecutive.tenureEnd),
            photoUrl: fetchedExecutive.photoUrl || undefined,
            projectsMd: fetchedExecutive.projectsMd || "",
            contactEmail: fetchedExecutive.contacts?.email || "",
            contactTwitter: fetchedExecutive.contacts?.twitter || "",
            contactInstagram: fetchedExecutive.contacts?.instagram || "",
            contactPhone: fetchedExecutive.contacts?.phone || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load executive data.");
      } finally {
        setLoadingExecutive(false);
      }
    };
    fetchExecutive();
  }, [slug, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!executiveId) return;
    setIsSubmitting(true);
    try {
      const updatedExecutive = {
        name: values.name,
        slug: values.slug,
        role: values.role,
        councilType: values.councilType,
        faculty: values.faculty || undefined,
        tenureStart: values.tenureStart.toISOString().split('T')[0]!,
        tenureEnd: values.tenureEnd.toISOString().split('T')[0]!,
        photoUrl: values.photoUrl || undefined,
        projectsMd: values.projectsMd || undefined,
        contacts: {
          email: values.contactEmail || undefined,
          twitter: values.contactTwitter || undefined,
          instagram: values.contactInstagram || undefined,
          phone: values.contactPhone || undefined,
        },
      };
      await api.executives.update(executiveId, updatedExecutive);
      toast.success("Profile updated successfully!");
      navigate("/admin/executives");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingExecutive) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Executive | KWASU SU Admin</title>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Edit Profile</h2>
            <p className="text-muted-foreground mt-1">Update the official information for this executive member.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/executives">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Layout className="h-4 w-4" />
                  Core Identity
                </div>
                <p className="text-sm text-muted-foreground">Basic information and council placement.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="councilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Council Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm">
                            <SelectValue placeholder="Select council" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {councilTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Doe" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Designated Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. President" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Faculty / Department</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <CalendarDays className="h-4 w-4" />
                  Tenure & Visuals
                </div>
                <p className="text-sm text-muted-foreground">Manage the official portrait and term dates.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenureStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-semibold">Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("h-12 pl-3 text-left font-normal rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                  <FormField
                    control={form.control}
                    name="tenureEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-semibold">End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("h-12 pl-3 text-left font-normal rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Official Photo</FormLabel>
                      <FormControl>
                        <ImageUpload label="Choose Portrait" bucketName="executive-photos" folderPath="public" value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Mail className="h-4 w-4" />
                  Transparency
                </div>
                <p className="text-sm text-muted-foreground">Add key projects and public contact details.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="projectsMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Key Projects (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What has this member achieved?" rows={5} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} className="rounded-xl border-brand-100" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contactPhone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} className="rounded-xl border-brand-100" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contactTwitter" render={({ field }) => (
                    <FormItem><FormLabel>Twitter</FormLabel><FormControl><Input {...field} className="rounded-xl border-brand-100" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contactInstagram" render={({ field }) => (
                    <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} className="rounded-xl border-brand-100" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </div>

            <div className="flex pt-6">
              <Button type="submit" className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Updating...</> : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditExecutive;