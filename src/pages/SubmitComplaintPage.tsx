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
import { Loader2, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ComplaintCategory } from "@/types";
import { useSession } from "@/components/SessionContextProvider";

const complaintCategories: ComplaintCategory[] = ['Welfare', 'Academics', 'Fees', 'Security', 'Other'];

const formSchema = z.object({
  category: z.string().min(1, { message: "Please select a category." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  isAnonymous: z.boolean().default(false),
  contactEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // If not anonymous, require at least one contact method
  if (!data.isAnonymous) {
    return !!data.contactEmail || !!data.contactPhone;
  }
  return true;
}, {
  message: "If not anonymous, please provide an email or phone number.",
  path: ["contactEmail"], // Attach error to email field for visibility
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

  // Update default email if user session loads
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
        // Explicitly use null for anonymous submissions to match SQL NULL type
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
        <meta name="description" content="Submit a formal complaint to the KWASU Students' Union regarding welfare, academics, or other issues." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-brand-700">Submit a Complaint</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Your feedback is important. Please fill out the form below to report an issue. All submissions are treated confidentially.
        </p>

        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <div className="pb-4">
            <h2 className="text-2xl font-semibold text-brand-700 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" /> Complaint Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Fields marked with * are required.
            </p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-brand-gold">
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
                      <FormLabel>Title/Summary *</FormLabel>
                      <FormControl>
                        <Input placeholder="Issue with hostel water supply" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Detailed Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the issue in detail, including location and time..." rows={6} {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="p-4 bg-brand-50 border-brand-200">
                  <CardTitle className="text-lg font-semibold mb-3 text-brand-700">Contact Information</CardTitle>
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Submit Anonymously
                          </FormLabel>
                          <FormDescription>
                            If checked, your identity will not be recorded. However, we won't be able to contact you for updates or clarification.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!isAnonymous && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please provide at least one contact method below:
                      </p>
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@kwasu.edu.ng" {...field} className="focus-visible:ring-brand-gold" />
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
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+23480..." {...field} className="focus-visible:ring-brand-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </Card>

                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Complaint...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitComplaintPage;