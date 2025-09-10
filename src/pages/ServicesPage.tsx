"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // Removed CardHeader
import { Button } => "@/components/ui/button";
import { Briefcase, MessageSquare, Download, Lightbulb } from "lucide-react"; // Removed FileText

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, href }) => (
  <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
    <div className="p-4 rounded-full bg-brand-100 text-brand-700 mb-4">
      <Icon className="h-8 w-8" />
    </div>
    <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
    <CardContent className="flex-grow text-sm text-muted-foreground mb-4">
      {description}
    </CardContent>
    <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold">
      <Link to={href}>Learn More</Link>
    </Button>
  </Card>
);

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Student Services | KWASU Students' Union</title>
        <meta name="description" content="Access various student services provided by KWASU Students' Union, including complaints, downloads, and opportunities." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Our Student Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={MessageSquare}
            title="Submit a Complaint"
            description="Have an issue? Let us know. Your feedback helps us improve student welfare."
            href="/services/complaints"
          />
          <ServiceCard
            icon={Download}
            title="Downloads"
            description="Access important documents, forms, and handbooks."
            href="/services/downloads"
          />
          <ServiceCard
            icon={Briefcase}
            title="Opportunities"
            description="Discover scholarships, internships, jobs, and other student opportunities."
            href="/services/opportunities"
          />
          <ServiceCard
            icon={Lightbulb}
            title="Suggestion Box"
            description="Share your ideas to make KWASU a better place for everyone."
            href="/services/suggestion-box"
          />
          {/* Add more service cards as needed */}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;