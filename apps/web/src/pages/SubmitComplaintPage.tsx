"use client";

import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ComplaintCategory } from "@/types";
import { useSession } from "@/components/SessionContextProvider";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";

const complaintCategories: ComplaintCategory[] = ['Welfare', 'Academics', 'Fees', 'Security', 'Other'];

const formSchema = z.object({
  category: z.string().min(1, { message: "Please select a category." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  isAnonymous: z.boolean().default(false),
  contactEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (!data.isAnonymous) {
    return !!data.contactEmail || !!data.contactPhone;
  }
  return true;
}, {
  message: "If not anonymous, please provide an email or phone number.",
  path: ["contactEmail"],
});

const SubmitComplaintPage: React.FC = () => {
  const { user } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      description: "",
      isAnonymous: false,
      contactEmail: user?.email || "",
      contactPhone: "",
    },
  });

  React.useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.setValue("contactEmail", user.email || "");
    }
  }, [user, form]);

  const isAnonymous = form.watch("isAnonymous");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const complaintPayload = {
        userId: values.isAnonymous ? null : user?.id, 
        category: values.category as ComplaintCategory,
        title: values.title,
        description: values.description,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
        isAnonymous: values.isAnonymous,
      };

      const newComplaint = await api.complaints.submit(complaintPayload);
      toast.success(`Complaint submitted successfully! Reference ID: ${newComplaint.id.substring(0, 8)}.`);
      form.reset({
        category: "",
        title: "",
        description: "",
        isAnonymous: false,
        contactEmail: user?.email || "",
        contactPhone: "",
      });
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Submit a Complaint | KWASU Students' Union"
        description="Report student welfare, academic, or security issues directly to the Kwara State University Students' Union executive committee."
        url="https://kwasusu.com.ng/services/complaints"
      />

      {/* Page Banner */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

        <div className="container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <Link
              to="/services"
              className="inline-flex items-center text-xs font-bold text-brand-300 hover:text-white mb-4 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px] mr-2" aria-hidden="true" />
              Back to Services
            </Link>
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Student Support & Advocacy
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Submit a{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Complaint
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Report welfare, academic, or security concerns directly to the Union executive committee. Submissions are treated confidentially.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-2xl mx-auto py-10 px-4">
        <FadeIn>
          <div className="bg-white border border-gray-100 rounded p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-triangle-exclamation text-xs" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Complaint Details</h2>
                <p className="text-[11px] text-gray-500">Provide clear information regarding your complaint.</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded border-gray-200 text-xs focus-visible:ring-brand-700">
                            <SelectValue placeholder="Select complaint category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {complaintCategories.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">Subject / Summary *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Issue with hostel water supply" {...field} className="h-10 rounded border-gray-200 text-xs focus-visible:ring-brand-700" />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">Detailed Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the incident or concern in detail..." rows={5} {...field} className="rounded border-gray-200 text-xs focus-visible:ring-brand-700" />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-gray-50/70 rounded border border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Contact Settings</h3>
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2.5 space-y-0 rounded p-3 bg-white border border-gray-100">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5 leading-none">
                          <FormLabel className="text-xs font-semibold text-gray-900 cursor-pointer">
                            Submit Anonymously
                          </FormLabel>
                          <FormDescription className="text-[11px] text-gray-500">
                            Your identity will not be logged. Note that executives won't be able to send direct status updates.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="student@kwasu.edu.ng" {...field} className="h-9 text-xs rounded border-gray-200 bg-white" />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-semibold text-gray-700">Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+234..." {...field} className="h-9 text-xs rounded border-gray-200 bg-white" />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-brand-900 hover:bg-brand-800 text-white rounded text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin text-xs" aria-hidden="true" />
                      Submitting Complaint...
                    </>
                  ) : (
                    <>
                      Submit Complaint
                      <i className="fa-solid fa-paper-plane text-[10px]" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </Form>
          </div>
        </FadeIn>
      </div>
    </>
  );
};

export default SubmitComplaintPage;