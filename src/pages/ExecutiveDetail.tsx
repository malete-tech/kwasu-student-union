"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Twitter, Instagram, Phone, ArrowLeft, User, Briefcase } from "lucide-react";
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
            <Skeleton className="h-[500px] w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !executive) {
    return (
      <div className="container py-12 text-center">
        <p className="text-destructive text-lg font-medium mb-6">{error || "Executive not found."}</p>
        <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 rounded-xl px-8">
          <Link to="/executives/central">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Link>
        </Button>
      </div>
    );
  }

  const councilPath = `/executives/${executive.councilType.toLowerCase()}`;

  return (
    <>
      <Helmet>
        <title>{executive.name} - {executive.role} | KWASU Students' Union</title>
        <meta name="description" content={`Profile of ${executive.name}, ${executive.role} of KWASU Students' Union.`} />
      </Helmet>
      
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to={councilPath}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {executive.councilType} Council
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Poster Style Profile Card */}
          <div className="lg:col-span-1">
            <Card className="relative overflow-hidden h-[550px] rounded-[2.5rem] border-none shadow-2xl bg-brand-900">
              {executive.photoUrl ? (
                <img
                  src={executive.photoUrl}
                  alt={executive.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 h-full w-full bg-brand-800 flex items-center justify-center">
                  <User className="h-32 w-32 text-brand-700" />
                </div>
              )}

              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="space-y-1 mb-6">
                  <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight uppercase tracking-tighter">
                    {executive.name}
                  </h1>
                  <p className="text-brand-gold text-xl font-bold uppercase tracking-widest">
                    {executive.role}
                  </p>
                  {executive.faculty && (
                    <p className="text-white/70 text-sm font-medium border-l-2 border-brand-gold pl-3 mt-3">
                      {executive.faculty}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-2 font-mono">
                    TERM: {executive.tenureStart.substring(0, 4)} — {executive.tenureEnd.substring(0, 4)}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                  {executive.contacts.email && (
                    <Button asChild variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-brand-900 border-none transition-all">
                      <a href={`mailto:${executive.contacts.email}`} aria-label="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.phone && (
                    <Button asChild variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-brand-900 border-none transition-all">
                      <a href={`tel:${executive.contacts.phone}`} aria-label="Phone">
                        <Phone className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.twitter && (
                    <Button asChild variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-brand-900 border-none transition-all">
                      <a href={`https://twitter.com/${executive.contacts.twitter}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {executive.contacts.instagram && (
                    <Button asChild variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-brand-900 border-none transition-all">
                      <a href={`https://instagram.com/${executive.contacts.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 rounded-[2rem] shadow-xl border-brand-50 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-brand-50">
                <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-extrabold text-brand-900 uppercase tracking-tight">Key Initiatives & Projects</CardTitle>
              </div>
              
              <CardContent className="p-0">
                {executive.projectsMd ? (
                  <div className="prose prose-brand max-w-none prose-headings:uppercase prose-headings:text-brand-800 prose-strong:text-brand-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {executive.projectsMd}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-brand-100 rounded-3xl bg-brand-50/20">
                    <Briefcase className="h-12 w-12 text-brand-200 mb-4" />
                    <p className="text-muted-foreground font-medium italic">Project details are being compiled for this tenure.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Contact Notice */}
            <div className="p-6 bg-brand-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-brand-gold">Get in touch</h3>
                <p className="text-white/60 text-sm">Need assistance? Reach out directly via official channels.</p>
              </div>
              <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 rounded-xl px-8 h-12 font-bold uppercase tracking-wider text-xs">
                <Link to="/contact">Send Official Inquiry</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveDetail;