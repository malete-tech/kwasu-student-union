"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { Executive } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/components/ui/font-awesome-icon";
import FadeIn from "@/components/FadeIn";

interface DetailedExecutive extends Executive {
  academicSession?: string;
  isPast?: boolean;
}

const ExecutiveDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [executive, setExecutive] = useState<DetailedExecutive | null>(null);
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
          setExecutive(data as DetailedExecutive);
        } else {
          setError("Executive profile not found.");
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
      <div className="container py-10 max-w-5xl">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-[3/4] w-full rounded" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-48 w-full rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !executive) {
    return (
      <div className="container py-20 text-center max-w-md">
        <i className="fa-solid fa-user-xmark text-4xl text-gray-300 mb-3" />
        <p className="text-sm font-semibold text-gray-700 mb-4">{error || "Executive profile not found."}</p>
        <Button asChild variant="outline" size="sm" className="rounded border-gray-200 text-xs font-bold">
          <Link to="/executives/central">
            <i className="fa-solid fa-arrow-left mr-2" /> Back to Directory
          </Link>
        </Button>
      </div>
    );
  }

  const isPastExec = Boolean(executive.academicSession || executive.isPast);
  const councilPath = isPastExec ? "/executives/past" : `/executives/${executive.councilType.toLowerCase()}`;
  const backLabel = isPastExec ? "Back to Hall of Fame & Past Leadership" : `Back to ${executive.councilType} Council`;

  return (
    <>
      <SEO
        title={`${executive.name} — ${executive.role} | KWASU SU`}
        description={`Profile and contact details of ${executive.name}, ${executive.role} of the Kwara State University Students' Union.`}
        image={executive.photoUrl ? (executive.photoUrl.startsWith('http') ? executive.photoUrl : `https://kwasusu.com.ng${executive.photoUrl}`) : 'https://kwasusu.com.ng/logo.png'}
        url={`https://kwasusu.com.ng/executives/${executive.slug}`}
      />

      {/* Top Breadcrumb Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container py-3 max-w-5xl">
          <Link
            to={councilPath}
            className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[10px] mr-2" />
            {backLabel}
          </Link>
        </div>
      </div>

      <div className="container py-10 max-w-5xl">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Profile Card */}
            <div className="lg:col-span-1 border border-brand-800 rounded bg-brand-900 overflow-hidden text-white">
              <div className="relative aspect-[3/4] w-full bg-brand-950 overflow-hidden">
                {executive.photoUrl ? (
                  <img
                    src={executive.photoUrl}
                    alt={executive.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-300">
                    <User className="h-20 w-20 opacity-40 mb-2" />
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">KWASU SU</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent" />
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                      {executive.role}
                    </span>
                    {isPastExec && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                        Past Leader
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-extrabold text-white leading-tight">
                    {executive.name}
                  </h1>
                </div>

                <div className="pt-3 border-t border-brand-800 space-y-1.5 text-xs text-brand-200">
                  <div className="flex justify-between">
                    <span className="text-brand-400 font-medium">Council</span>
                    <span className="font-bold text-white">{executive.councilType} Council</span>
                  </div>
                  {executive.faculty && (
                    <div className="flex justify-between">
                      <span className="text-brand-400 font-medium">Faculty</span>
                      <span className="font-bold text-white truncate max-w-[140px]">{executive.faculty}</span>
                    </div>
                  )}
                  {executive.academicSession && (
                    <div className="flex justify-between">
                      <span className="text-brand-400 font-medium">Tenure Session</span>
                      <span className="font-bold text-brand-gold">{executive.academicSession}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-brand-400 font-medium">Tenure Period</span>
                    <span className="font-bold text-white">
                      {executive.tenureStart.substring(0, 4)} – {executive.tenureEnd.substring(0, 4)}
                    </span>
                  </div>
                </div>

                {/* Contacts */}
                {(executive.contacts.email ||
                  executive.contacts.phone ||
                  executive.contacts.linkedin ||
                  executive.contacts.twitter ||
                  executive.contacts.instagram) && (
                  <div className="pt-3 border-t border-brand-800">
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">
                      Direct Channels
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {executive.contacts.email && (
                        <a
                          href={`mailto:${executive.contacts.email}`}
                          className="w-8 h-8 rounded flex items-center justify-center bg-brand-800 hover:bg-brand-gold hover:text-brand-900 text-white transition-colors"
                          title="Email"
                        >
                          <i className="fa-solid fa-envelope text-xs" />
                        </a>
                      )}
                      {executive.contacts.phone && (
                        <a
                          href={`tel:${executive.contacts.phone}`}
                          className="w-8 h-8 rounded flex items-center justify-center bg-brand-800 hover:bg-brand-gold hover:text-brand-900 text-white transition-colors"
                          title="Phone"
                        >
                          <i className="fa-solid fa-phone text-xs" />
                        </a>
                      )}
                      {executive.contacts.linkedin && (
                        <a
                          href={executive.contacts.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded flex items-center justify-center bg-brand-800 hover:bg-brand-gold hover:text-brand-900 text-white transition-colors"
                          title="LinkedIn"
                        >
                          <i className="fa-brands fa-linkedin text-xs" />
                        </a>
                      )}
                      {executive.contacts.twitter && (
                        <a
                          href={`https://twitter.com/${executive.contacts.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded flex items-center justify-center bg-brand-800 hover:bg-brand-gold hover:text-brand-900 text-white transition-colors"
                          title="Twitter / X"
                        >
                          <i className="fa-brands fa-x-twitter text-xs" />
                        </a>
                      )}
                      {executive.contacts.instagram && (
                        <a
                          href={`https://instagram.com/${executive.contacts.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded flex items-center justify-center bg-brand-800 hover:bg-brand-gold hover:text-brand-900 text-white transition-colors"
                          title="Instagram"
                        >
                          <i className="fa-brands fa-instagram text-xs" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Initiatives & Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-100 rounded bg-white p-6">
                <div className="pb-4 mb-6 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">
                    Tenure Profile
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    Key Initiatives & Mandate
                  </h2>
                </div>

                {executive.projectsMd ? (
                  <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-brand-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {executive.projectsMd}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded">
                    <i className="fa-solid fa-file-signature text-2xl text-gray-300 mb-2" />
                    <p>Mandate and project documentation is currently being compiled for this office.</p>
                  </div>
                )}
              </div>

              {/* Inquiry Notice */}
              <div className="border border-brand-800 rounded bg-brand-900 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-brand-gold">Official Union Inquiry</h3>
                  <p className="text-xs text-brand-200 mt-0.5">Need to contact this office for student welfare matters?</p>
                </div>
                <Button asChild size="sm" className="bg-brand-gold text-brand-900 hover:bg-brand-gold/90 font-bold text-xs shrink-0">
                  <Link to="/contact">Contact Union Office</Link>
                </Button>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </>
  );
};

export default ExecutiveDetail;