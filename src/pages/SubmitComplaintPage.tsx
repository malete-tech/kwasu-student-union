"use client";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ComplaintCategory } from "@/types";
import { useSession } from "@/components/SessionContextProvider";
import { Link } from "react-router-dom";

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
      toast.success(`Complaint submitted successfully! Your reference ID is ${newComplaint.id.substring(0, 8)}.`);
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
      <Helmet>
        <title>Submit Complaint | KWASU Students' Union</title>
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Submit a Complaint</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Your feedback is important. Please fill out the form below to report an issue. All submissions are treated confidentially.
        </p>

        <div className="max-w-3xl mx-auto">
          <Card className="p-6 sm:p-8 shadow-xl border-brand-100">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-brand-50">
              <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-900 uppercase">Complaint Details</CardTitle>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-brand-700 uppercase text-xs tracking-wider">Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold">
                            <SelectValue placeholder="Select complaint category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {complaintCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-brand-700 uppercase text-xs tracking-wider">Title/Summary *</FormLabel>
                      <FormControl>
                        <Input placeholder="Issue with hostel water supply" {...field} className="h-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="font-bold text-brand-700 uppercase text-xs tracking-wider">Detailed Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the issue in detail, including location and time..." rows={6} {...field} className="rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 sm:p-6 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-4">
                  <h3 className="font-bold text-brand-700 uppercase text-xs tracking-wider mb-4">Contact Information</h3>
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-white shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-semibold text-brand-800">
                            Submit Anonymously
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Your identity will not be recorded, but we won't be able to contact you for updates.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-brand-600">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@kwasu.edu.ng" {...field} className="h-11 rounded-xl border-brand-100 bg-white" />
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
                            <FormLabel className="text-xs font-semibold text-brand-600">Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+234..." {...field} className="h-11 rounded-xl border-brand-100 bg-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-bold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubmitComplaintPage;