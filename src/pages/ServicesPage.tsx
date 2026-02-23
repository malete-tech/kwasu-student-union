"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, href, buttonText }) => (
  <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
    <div className="p-4 rounded-full bg-brand-100 text-brand-700 mb-4">
      <i className={`${icon} text-3xl`}></i>
    </div>
    <CardTitle className="text-xl font-semibold mb-2 uppercase">{title}</CardTitle>
    <CardContent className="flex-grow text-sm text-muted-foreground mb-4">
      {description}
    </CardContent>
    <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 focus-visible:ring-brand-gold w-full sm:w-auto px-8 font-bold">
      <Link to={href}>{buttonText}</Link>
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
    </>
  );
};

export default ServicesPage;