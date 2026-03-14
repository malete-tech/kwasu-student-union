"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Handshake, Layout, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  websiteUrl: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  logoUrl: z.string().optional(),
  isVerified: z.boolean().default(false),
  tier: z.enum(['basic', 'premium']).default('basic'),
});

const EditPartner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      websiteUrl: "",
      logoUrl: undefined,
      isVerified: false,
      tier: 'basic',
    },
  });

  useEffect(() => {
    const fetchPartner = async () => {
      if (!id) return;
      try {
        const data = await api.partners.getById(id);
        if (data) {
          form.reset({
            name: data.name,
            description: data.description,
            category: data.category,
            websiteUrl: data.websiteUrl || "",
            logoUrl: data.logoUrl || undefined,
            isVerified: data.isVerified,
            tier: data.tier,
          });
        }
      } catch (err) {
        toast.error("Failed to load partner data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await api.partners.update(id, {
        name: values.name,
        description: values.description,
        category: values.category,
        websiteUrl: values.websiteUrl || undefined,
        logoUrl: values.logoUrl || undefined,
        isVerified: values.isVerified,
        tier: values.tier,
      });
      toast.success("Partner updated successfully!");
      navigate("/admin/partners");
    } catch (error) {
      console.error("Failed to update partner:", error);
      toast.error("Failed to update partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        <title>Edit Partner | Admin</title>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Edit Partner</h2>
            <p className="text-muted-foreground mt-1">Update the details for this organization.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/partners">
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
                  Identity & Branding
                </div>
                <p className="text-sm text-muted-foreground">Basic information and visual representation.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Partner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. TechHub Solutions" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Company Logo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          label="Change Logo" 
                          bucketName="partner-logos" 
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

            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Handshake className="h-4 w-4" />
                  Details & Classification
                </div>
                <p className="text-sm text-muted-foreground">Describe what they offer and categorize them.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Education, Food, Tech" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What does this partner do for students?" rows={4} {...field} className="rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Website URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                  <ShieldCheck className="h-4 w-4" />
                  Status & Tier
                </div>
                <p className="text-sm text-muted-foreground">Control visibility and verification status.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Listing Tier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm">
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic (Standard Listing)</SelectItem>
                          <SelectItem value="premium">Premium (Featured at Top)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Premium partners are highlighted and shown first.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-brand-50/30">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-700 font-semibold">Good Standing / Verified</FormLabel>
                        <FormDescription>Show the "SU Verified" badge on this partner's card.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex pt-6">
              <Button type="submit" className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Saving...</> : "Update Partner"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditPartner;