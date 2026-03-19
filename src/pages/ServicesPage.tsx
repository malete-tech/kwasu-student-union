"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  isExternal?: boolean;
  featured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  href, 
  buttonText, 
  isExternal = false,
  featured = false 
}) => (
  <Card className={cn(
    "flex flex-col items-center text-center p-6 transition-all duration-300 rounded-2xl relative overflow-hidden",
    featured 
      ? "shadow-2xl border-brand-gold bg-gradient-to-b from-white to-brand-gold/5 scale-105 z-10" 
      : "shadow-lg hover:shadow-xl border-brand-50 bg-white"
  )}>
    {featured && (
      <div className="absolute top-0 right-0">
        <Badge className="bg-brand-gold text-brand-900 rounded-none rounded-bl-xl font-bold uppercase text-[10px] px-3 py-1">
          Union Venture
        </Badge>
      </div>
    )}
    <div className={cn(
      "p-4 rounded-full mb-4",
      featured ? "bg-brand-gold text-brand-900" : "bg-brand-100 text-brand-700"
    )}>
      <i className={`${icon} text-3xl`}></i>
    </div>
    <CardTitle className="text-xl font-bold mb-2 uppercase tracking-tight">{title}</CardTitle>
    <CardContent className="flex-grow text-sm text-muted-foreground mb-4">
      {description}
    </CardContent>
    
    {isExternal ? (
      <Button asChild className={cn(
        "w-full sm:w-auto px-8 font-bold shadow-md",
        featured ? "bg-brand-900 hover:bg-black text-white" : "bg-brand-gold hover:bg-brand-gold/90 text-brand-900"
      )}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonText} <i className="fa-brands fa-whatsapp ml-2 text-lg"></i>
        </a>
      </Button>
    ) : (
      <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold w-full sm:w-auto px-8 font-bold">
        <Link to={href}>{buttonText}</Link>
      </Button>
    )}
  </Card>
);

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Student Services | KWASU Students' Union</title>
        <meta name="description" content="Access various student services provided by KWASU Students' Union, including kerosene depot, printing services, and complaints." />
      </Helmet>
      <div className="container py-12">
        {/* Union Ventures Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Union Ventures</h2>
            <h1 className="text-4xl font-black text-brand-900 uppercase tracking-tighter">Commercial Services</h1>
            <div className="h-1.5 w-24 bg-brand-gold mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto px-4">
            <ServiceCard
              icon="fa-solid fa-fire-flame-simple"
              title="SU Kerosene Depot"
              description="Affordable and accessible kerosene for all students. Quality fuel at union-regulated prices."
              href="https://wa.me/message/D75QRKLIXRFFA1"
              buttonText="Order on WhatsApp"
              isExternal
              featured
            />
            <ServiceCard
              icon="fa-solid fa-print"
              title="SU Cafe"
              description="Professional printing, photocopying, and digital services. Fast, reliable, and student-friendly rates."
              href="https://wa.me/message/T2EV3QZOQPAVC1"
              buttonText="Chat with Cafe"
              isExternal
              featured
            />
          </div>
        </div>

        {/* Standard Services Section */}
        <div className="pt-12 border-t border-brand-50">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Administrative</h2>
            <h2 className="text-3xl font-bold text-brand-700 uppercase tracking-tight">Student Support</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ServiceCard
              icon="fa-solid fa-comment-dots"
              title="Submit a Complaint"
              description="Have an issue? Let us know. Your feedback helps us improve student welfare."
              href="/services/complaints"
              buttonText="File Report"
            />
            <ServiceCard
              icon="fa-solid fa-file-arrow-down"
              title="Downloads"
              description="Access important documents, forms, and handbooks."
              href="/services/downloads"
              buttonText="Browse Vault"
            />
            <ServiceCard
              icon="fa-solid fa-briefcase"
              title="Opportunities"
              description="Discover scholarships, internships, jobs, and other student opportunities."
              href="/services/opportunities"
              buttonText="Explore Now"
            />
            <ServiceCard
              icon="fa-solid fa-lightbulb"
              title="Suggestion Box"
              description="Share your ideas to make KWASU a better place for everyone."
              href="/services/suggestion-box"
              buttonText="Submit Idea"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;