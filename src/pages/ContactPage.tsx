"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ContactPage: React.FC = () => {
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

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-brand-700">Your Name</Label>
                  <Input id="name" placeholder="John Doe" className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-brand-700">Your Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-brand-700">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" className="h-11 rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-brand-700">Message</Label>
                <Textarea id="message" placeholder="Type your message here." rows={5} className="rounded-xl border-brand-100 focus-visible:ring-brand-gold" />
              </div>
              <Button type="submit" className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md font-bold transition-all">
                Send Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ContactPage;