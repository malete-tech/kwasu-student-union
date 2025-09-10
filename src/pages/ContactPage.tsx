"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | KWASU Students' Union</title>
        <meta name="description" content="Get in touch with KWASU Students' Union. Find our contact details and send us a message." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="p-6 shadow-lg rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-brand-700">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-brand-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-brand-800">Email Us</h3>
                  <p className="text-muted-foreground">
                    For general inquiries: <a href="mailto:info@kwasusu.edu" className="text-brand-500 hover:underline">info@kwasusu.edu</a>
                  </p>
                  <p className="text-muted-foreground">
                    For support: <a href="mailto:support@kwasusu.edu" className="text-brand-500 hover:underline">support@kwasusu.edu</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-brand-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-brand-800">Call Us</h3>
                  <p className="text-muted-foreground">
                    President's Office: <a href="tel:+2348012345678" className="text-brand-500 hover:underline">+234 801 234 5678</a>
                  </p>
                  <p className="text-muted-foreground">
                    Welfare Desk: <a href="tel:+2348098765432" className="text-brand-500 hover:underline">+234 809 876 5432</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-brand-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-brand-800">Our Office</h3>
                  <p className="text-muted-foreground">
                    Students' Union Building, Main Campus,
                  </p>
                  <p className="text-muted-foreground">
                    Kwara State University, Malete, Kwara State, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="mr-4 h-6 w-6 text-brand-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-brand-800">Office Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 4:00 PM
                  </p>
                  <p className="text-muted-foreground">
                    Weekends & Public Holidays: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="p-6 shadow-lg rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-brand-700">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="John Doe" className="focus-visible:ring-brand-gold" />
                </div>
                <div>
                  <Label htmlFor="email">Your Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" className="focus-visible:ring-brand-gold" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Inquiry about..." className="focus-visible:ring-brand-gold" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here." rows={5} className="focus-visible:ring-brand-gold" />
                </div>
                <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ContactPage;