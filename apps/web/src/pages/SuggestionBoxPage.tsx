"use client";

import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";

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
        isAnonymous: true,
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
      <SEO
        title="Student Suggestion Box | KWASU SU"
        description="Share innovative ideas, feedback, and suggestions with the KWASU Students' Union to improve campus life and academic welfare."
        url="https://kwasusu.com.ng/services/suggestion-box"
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
              Student Voice & Feedback
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Suggestion{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Box
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-lg">
              Have an idea to improve student life or union operations? Share your proposal with us.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-2xl mx-auto py-10 px-4">
        <FadeIn>
          <div className="bg-white border border-gray-100 rounded p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-lightbulb text-xs" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Share Your Proposal</h2>
                <p className="text-[11px] text-gray-500">Suggestions are logged anonymously to encourage open feedback.</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">Concept / Topic *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Digital Library Extension Initiative" {...field} className="h-10 rounded border-gray-200 text-xs focus-visible:ring-brand-700" />
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
                      <FormLabel className="text-xs font-bold text-gray-700">Proposal Details *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Elaborate on your idea and explain how it benefits the KWASU community..." rows={5} {...field} className="rounded border-gray-200 text-xs focus-visible:ring-brand-700" />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-brand-900 hover:bg-brand-800 text-white rounded text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin text-xs" aria-hidden="true" />
                      Submitting Proposal...
                    </>
                  ) : (
                    <>
                      Submit Suggestion
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

export default SuggestionBoxPage;