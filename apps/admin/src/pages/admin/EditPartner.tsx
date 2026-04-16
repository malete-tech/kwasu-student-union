"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Layout, Target, CalendarDays, ShieldCheck } from "lucide-react";
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
import PartnerLogoUpload from "@/components/PartnerLogoUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

const PLACEMENT_OPTIONS = [
  { id: 'news_feed', label: 'News Feed' },
  { id: 'events_feed', label: 'Events Page' },
  { id: 'opportunities_feed', label: 'Opportunities Page' },
] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  websiteUrl: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  logoUrl: z.string().optional(),
  isVerified: z.boolean().default(false),
  tier: z.enum(['basic', 'premium']).default('basic'),
  placements: z.array(z.string()).min(1, { message: "Select at least one target page." }),
  status: z.enum(['active', 'paused', 'expired']).default('active'),
  startDate: z.string(),
  endDate: z.string().optional(),
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
      placements: [],
      status: 'active',
      startDate: "",
      endDate: "",
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
            placements: data.placements || [],
            status: data.status,
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
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
        placements: values.placements as any,
        status: values.status,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      });
      toast.success("Partner updated successfully!");
      navigate("/partners");
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
        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-brand-700 hover:bg-brand-50 rounded-xl shrink-0 transition-all">
            <Link to="/partners">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-brand-900 uppercase tracking-tight truncate">Edit Partner</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 line-clamp-1">{form.getValues("name")}</p>
          </div>
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
                        <PartnerLogoUpload 
                          label="Change Logo" 
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
                  <Layout className="h-4 w-4" />
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
                  <Target className="h-4 w-4" />
                  Placement & Targeting
                </div>
                <p className="text-sm text-muted-foreground">Where should this ad appear on the site?</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="placements"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-slate-700 font-semibold">Target Pages</FormLabel>
                        <FormDescription>Select all pages where this ad should be displayed.</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PLACEMENT_OPTIONS.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="placements"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-white shadow-sm"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
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
                  Campaign Schedule & Status
                </div>
                <p className="text-sm text-muted-foreground">Control the duration and status of the ad.</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Campaign Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="basic">Basic (Standard)</SelectItem>
                            <SelectItem value="premium">Premium (Featured)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-brand-500" /> Verified Partner
                          </FormLabel>
                          <FormDescription className="text-[10px]">Show verification badge</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl border-brand-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl border-brand-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Campaign Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active (Live)</SelectItem>
                          <SelectItem value="paused">Paused (Draft)</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
