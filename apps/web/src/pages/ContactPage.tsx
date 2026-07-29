"use client";

import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Loader2 } from "@/components/ui/font-awesome-icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";
import FadeIn from "@/components/FadeIn";

// ─── Form schema ─────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// ─── Contact channels data ────────────────────────────────────────────────────

const channels = [
  {
    icon: "fa-solid fa-envelope",
    label: "Email",
    value: "student.union@kwasu.edu.ng",
    href: "mailto:student.union@kwasu.edu.ng",
  },
  {
    icon: "fa-solid fa-phone",
    label: "PRO's Line",
    value: "08113887492",
    href: "tel:+2348113887492",
  },
  {
    icon: "fa-solid fa-location-dot",
    label: "Office",
    value: "Students' Union Building, Behind Faculty of Information and Technology, KWASU, Malete.",
    href: null,
  },
  {
    icon: "fa-solid fa-clock",
    label: "Hours",
    value: "Monday – Friday, 09:00 AM – 04:00 PM",
    note: "Closed on weekends and public holidays",
    href: null,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ContactPage: React.FC = () => {
  const { user } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const inquiryPayload = {
        userId: user?.id || null,
        category: "Inquiry" as const,
        title: values.subject,
        description: `Name: ${values.name}\n\nMessage: ${values.message}`,
        contactEmail: values.email,
        isAnonymous: false,
      };
      await api.complaints.submit(inquiryPayload);
      toast.success("Inquiry sent! We will get back to you shortly.");
      form.reset({ name: "", email: user?.email || "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send inquiry:", error);
      toast.error("Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | KWASU Students' Union"
        description="Get in touch with the Kwara State University Students' Union executive council. Send inquiries, feedback, or official communications."
        url="https://kwasusu.com.ng/contact"
      />

      {/* ── PAGE BANNER ───────────────────────────────────────────────────── */}
      <section className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden">
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
            <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              KWASU Students' Union
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Get in{" "}
              <span
                className="text-brand-gold"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "hsl(40 80% 60% / 0.35)",
                  textUnderlineOffset: "6px",
                }}
              >
                Touch
              </span>
            </h1>
            <p className="text-brand-200 text-sm leading-relaxed max-w-md">
              Reach out through any official channel or send us a direct message
              and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* ── LEFT: Contact channels ────────────────────────────────── */}
          <FadeIn direction="right">
            <div>
              <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-6">
                Official Channels
              </p>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded">
                {channels.map((ch) => (
                  <div key={ch.label} className="flex items-start gap-4 px-5 py-5">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded bg-brand-50 text-brand-600">
                      <i className={`${ch.icon} text-sm`} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.12em] mb-1">
                        {ch.label}
                      </p>
                      {ch.href ? (
                        <a
                          href={ch.href}
                          className="text-sm font-medium text-brand-900 hover:text-brand-600 transition-colors break-all"
                        >
                          {ch.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">{ch.value}</p>
                      )}
                      {ch.note && (
                        <p className="text-xs text-gray-400 mt-0.5">{ch.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links strip */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-3">
                  Follow us
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://x.com/kwasusu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors text-sm"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a
                    href="https://instagram.com/kwasusu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors text-sm"
                  >
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a
                    href="https://facebook.com/kwasusu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors text-sm"
                  >
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── RIGHT: Contact form ───────────────────────────────────── */}
          <FadeIn direction="left" delay={0.1}>
            <div>
              <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.15em] mb-6">
                Send a Message
              </p>

              <div className="border border-gray-100 rounded p-6 bg-white">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                              Your Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="h-9 rounded border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                              Your Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                                className="h-9 rounded border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this regarding?"
                              {...field}
                              className="h-9 rounded border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here…"
                              rows={5}
                              {...field}
                              className="rounded border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500 resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 bg-brand-700 hover:bg-brand-600 text-white rounded text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send Inquiry"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  );
};

export default ContactPage;