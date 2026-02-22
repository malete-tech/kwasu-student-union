"use client";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lightbulb, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";
import { Link } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Please elaborate on your suggestion." }),
});

const SuggestionBoxPage: React.FC = () => {
  const { user } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const suggestionPayload = {
        userId: user?.id || null, 
        category: 'Suggestion' as const,
        title: values.title,
        description: values.description,
        isAnonymous: true, // Suggestions are anonymous by default in this interface
      };

      await api.complaints.submit(suggestionPayload);
      toast.success("Thank you for your suggestion! We appreciate your feedback.");
      form.reset();
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      toast.error("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Suggestion Box | KWASU Students' Union</title>
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Suggestion Box</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Have an idea to improve student life? We're all ears. Your suggestions help shape a better KWASU for everyone.
        </p>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 shadow-xl border-brand-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-50">
              <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                <Lightbulb className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-900 uppercase">Share Your Idea</CardTitle>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-brand-700 uppercase text-xs tracking-wider">Concept / Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Digital Library Extension" {...field} className="h-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="font-bold text-brand-700 uppercase text-xs tracking-wider">Proposal Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain your idea and how it benefits the student community..." rows={6} {...field} className="rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-bold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Idea...
                    </>
                  ) : (
                    "Submit Suggestion"
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Note: Suggestions are submitted anonymously to encourage open feedback.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SuggestionBoxPage;