"use client";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

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
      // Mapping contact form to the complaints schema as an 'Inquiry'
      const inquiryPayload = {
        userId: user?.id || null,
        category: 'Inquiry' as const,
        title: values.subject,
        description: `Name: ${values.name}\n\nMessage: ${values.message}`,
        contactEmail: values.email,
        isAnonymous: false,
      };

      await api.complaints.submit(inquiryPayload);
      toast.success("Inquiry sent! We will get back to you shortly.");
      form.reset({
        name: "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send inquiry:", error);
      toast.error("Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | KWASU Students' Union</title>
        <meta name="description" content="Get in touch with KWASU Students' Union. Reach out to the PRO or visit our office." />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Contact Us</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Have questions or need assistance? Reach out to the Students' Union through any of our official channels.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="p-6 shadow-xl border-brand-100 bg-white/50">
            <CardHeader className="flex flex-row items-center gap-3 mb-8 pb-4 border-b border-brand-50 p-0 space-y-0">
              <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                <i className="fa-solid fa-address-book text-xl"></i>
              </div>
              <CardTitle className="text-2xl font-bold text-brand-900 uppercase">Official Channels</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8 p-0">
              <div className="flex items-start group">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-500 mr-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-envelope h-5 w-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-800 uppercase text-xs tracking-wider mb-1">Email Correspondence</h3>
                  <p className="text-gray-700">
                    <a href="mailto:student.union@kwasu.edu.ng" className="hover:text-brand-500 transition-colors">student.union@kwasu.edu.ng</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-500 mr-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-phone h-5 w-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-800 uppercase text-xs tracking-wider mb-1">PRO's Contact</h3>
                  <p className="text-gray-700 font-semibold tracking-wide">
                    <a href="tel:+2348113887492" className="hover:text-brand-500 transition-colors">08113887492</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-500 mr-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-location-dot h-5 w-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-800 uppercase text-xs tracking-wider mb-1">Physical Location</h3>
                  <p className="text-gray-700">
                    Students' Union Building, Behind Faculty of Information and Technology, Kwara State University, Malete.
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-500 mr-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-clock h-5 w-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-800 uppercase text-xs tracking-wider mb-1">Service Hours</h3>
                  <p className="text-gray-700">Monday - Friday: 09:00 AM - 04:00 PM</p>
                  <p className="text-xs text-muted-foreground mt-1 italic">Closed on weekends and holidays</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="p-6 shadow-xl border-brand-100">
            <CardHeader className="flex flex-row items-center gap-3 mb-8 pb-4 border-b border-brand-50 p-0 space-y-0">
              <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                <i className="fa-solid fa-paper-plane text-xl"></i>
              </div>
              <CardTitle className="text-2xl font-bold text-brand-900 uppercase">Send Message</CardTitle>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-brand-700">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-brand-700">Your Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-brand-700">Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this regarding?" {...field} className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-brand-700">Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Type your message here." rows={5} {...field} className="rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md font-bold transition-all" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Inquiry"
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

export default ContactPage;