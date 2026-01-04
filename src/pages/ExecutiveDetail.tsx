"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Twitter, Instagram, Phone, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ExecutiveDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutive = async () => {
      if (!slug) {
        setError("Executive slug is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await api.executives.getBySlug(slug);
        if (data) {
          setExecutive(data);
        } else {
          setError("Executive not found.");
        }
      } catch (err) {
        console.error("Failed to fetch executive details:", err);
        setError("Failed to load executive details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExecutive();
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg rounded-2xl">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-center gap-4 mt-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 shadow-lg rounded-2xl">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
            <Card className="p-6 shadow-lg rounded-2xl">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
            <Card className="p-6 shadow-lg rounded-2xl">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-destructive text-lg">
        {error}
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/executives/central">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!executive) {
    return (
      <div className="container py-12 text-center text-muted-foreground text-lg">
        Executive data is not available.
        <div className="mt-6">
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/executives/central">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{executive.name} - {executive.role} | KWASU Students' Union</title>
        <meta name="description" content={`Profile of ${executive.name}, ${executive.role} of KWASU Students' Union. Read their manifesto and projects.`} />
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="outline" className="mb-8 border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
          <Link to="/executives/central">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Executives
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Executive Info Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg rounded-2xl text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4 border-2 border-brand-500">
                <AvatarImage src={executive.photoUrl || "/placeholder.svg"} alt={executive.name} />
                <AvatarFallback className="bg-brand-100 text-brand-700 text-4xl">
                  {executive.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold text-brand-700 mb-2">{executive.name}</CardTitle>
              <CardDescription className="text-xl text-brand-600 font-semibold mb-4">
                {executive.role}
              </CardDescription>
              <p className="text-md text-muted-foreground mb-2">{executive.faculty}</p>
              <p className="text-sm text-gray-500">
                Tenure: {executive.tenureStart.substring(0, 4)} - {executive.tenureEnd.substring(0, 4)}
              </p>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-3 text-brand-700">Contact {executive.name.split(' ')[0]}</h3>
                <div className="flex justify-center gap-4">
                  {executive.contacts.email && (
                    <Button asChild variant="ghost" size="icon" className="text-brand-500 hover:text-brand-700 focus-visible:ring-brand-gold">
                      <a href={`mailto:${executive.contacts.email}`} aria-label="Email">
                        <Mail className="h-6 w-6" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.twitter && (
                    <Button asChild variant="ghost" size="icon" className="text-brand-500 hover:text-brand-700 focus-visible:ring-brand-gold">
                      <a href={`https://twitter.com/${executive.contacts.twitter}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter className="h-6 w-6" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.instagram && (
                    <Button asChild variant="ghost" size="icon" className="text-brand-500 hover:text-brand-700 focus-visible:ring-brand-gold">
                      <a href={`https://instagram.com/${executive.contacts.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram className="h-6 w-6" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.phone && (
                    <Button asChild variant="ghost" size="icon" className="text-brand-500 hover:text-brand-700 focus-visible:ring-brand-gold">
                      <a href={`tel:${executive.contacts.phone}`} aria-label="Phone">
                        <Phone className="h-6 w-6" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Executive Details (Projects) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Removed Biography Card */}
            {/* Removed Manifesto Card */}

            {executive.projectsMd && (
              <Card className="p-6 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-brand-700">Key Projects</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {executive.projectsMd}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveDetail;