"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Users, CalendarDays, Mail } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Executive } from "@/types";
import { Helmet } from "react-helmet-async";

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

const AddExecutive: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      role: "",
      councilType: 'Central', // Default to Central
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

  // Auto-generate slug from name
  const name = form.watch("name");
  React.useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      form.setValue("slug", generatedSlug);
    }
  }, [name, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newExecutive = {
        name: values.name,
        slug: values.slug,
        role: values.role,
        councilType: values.councilType, // Include new field
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
      await api.executives.create(newExecutive);
      toast.success("Executive profile added successfully!");
      form.reset();
      navigate("/admin/executives");
    } catch (error) {
      console.error("Failed to add executive profile:", error);
      toast.error("Failed to add executive profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Executive | KWASU SU Admin</title>
        <meta name="description" content="Add a new executive profile to the KWASU Students' Union website." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Add Executive Profile</h2>
            <p className="text-muted-foreground mt-1">Create a new profile for a member of the executive, senate, or judiciary council.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/executives">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives Management
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 rounded-2xl shadow-lg">
            {/* 1. Core Details Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Users className="h-4 w-4" />
                  Profile Information
                </div>
                <p className="text-sm text-muted-foreground">Define the name, role, council type, and faculty of the executive.</p>
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
                            <SelectValue placeholder="Select the council" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {councilTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
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
                      <FormLabel className="text-slate-700 font-semibold">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Role</FormLabel>
                      <FormControl>
                        <Input placeholder="President" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Faculty (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Social Sciences" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                        <Input placeholder="john-doe-president" {...field} className="h-10 rounded-xl border-brand-100 bg-slate-50/50 text-slate-500 font-mono text-sm focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Tenure & Photo Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <CalendarDays className="h-4 w-4" />
                  Tenure & Photo
                </div>
                <p className="text-sm text-muted-foreground">Set the start and end dates of their term and upload a professional photo.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenureStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-semibold">Tenure Start Date</FormLabel>
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
                    name="tenureEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 font-semibold">Tenure End Date</FormLabel>
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
                </div>
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Photo</FormLabel>
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
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Projects & Contact Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Mail className="h-4 w-4" />
                  Projects & Contact
                </div>
                <p className="text-sm text-muted-foreground">Add key projects and optional contact details for transparency.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="projectsMd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Key Projects (Markdown, Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List key projects using Markdown..." rows={5} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h4 className="text-lg font-semibold text-brand-700 mt-8 mb-2">Contact Information (Optional)</h4>
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="executive@kwasusu.edu" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                        <Input placeholder="johndoe_kwasu" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel>Instagram Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe_kwasu" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                        <Input type="tel" placeholder="+2348012345678" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                    Adding Executive...
                  </>
                ) : (
                  "Add Executive Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddExecutive;