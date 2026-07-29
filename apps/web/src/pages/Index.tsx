"use client";

import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Spotlight } from "@/types";
import SpotlightCard from "@/components/SpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import QuickLinks from "@/components/QuickLinks";
import ExecutiveProfilesSection from "@/components/ExecutiveProfilesSection";
import NewsFeedSection from "@/components/NewsFeedSection";
import EventsCalendarSection from "@/components/EventsCalendarSection";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import CampusPhotoSlider from "@/components/CampusPhotoSlider";

// ── Campus photos for hero slider ────────────────────────────────────────────
const heroImages = [
  { url: "/about-gallery/photo1.jpg", alt: "KWASU campus life" },
  { url: "/about-gallery/photo2.jpg", alt: "Student leadership" },
  { url: "/about-gallery/photo3.jpg", alt: "Campus community" },
  { url: "/about-gallery/photo4.jpg", alt: "Student synergy" },
  { url: "/about-gallery/photo5.jpg", alt: "Student advocacy" },
  { url: "/about-gallery/photo6.jpg", alt: "Academic excellence" },
];

// ── Services strip data ───────────────────────────────────────────────────────
const serviceItems = [
  {
    icon: "fa-solid fa-comment-dots",
    title: "Submit a Complaint",
    desc: "Report welfare issues directly to the union.",
    href: "/services/complaints",
  },
  {
    icon: "fa-solid fa-file-arrow-down",
    title: "Downloads",
    desc: "Handbooks, forms, and official documents.",
    href: "/services/downloads",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Opportunities",
    desc: "Scholarships, internships, and jobs.",
    href: "/services/opportunities",
  },
  {
    icon: "fa-solid fa-lightbulb",
    title: "Suggestion Box",
    desc: "Share ideas that make KWASU better.",
    href: "/services/suggestion-box",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const Index = () => {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const data = await api.spotlight.getAll();
        setSpotlight(data[0] ?? null);
      } catch {
        // Non-critical
      } finally {
        setSpotlightLoading(false);
      }
    };
    fetchSpotlight();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>KWASU Students' Union | Official Hub for News, Events & Advocacy</title>
        <meta
          name="description"
          content="Stay connected with the Kwara State University Students' Union. Access official news, upcoming campus events, executive profiles, and essential student services."
        />
        <link rel="canonical" href="https://thekwasusu.com/" />
      </Helmet>

      {/* ── ANNOUNCEMENT TICKER ──────────────────────────────────────────── */}
      <AnnouncementBanner />

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-brand-900 border-b border-brand-800 overflow-hidden"
        aria-label="Hero"
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />
        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold" aria-hidden="true" />

        <div className="container relative py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Identity + CTAs */}
            <div className="max-w-xl">
              <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.15em] mb-4">
                KWASU Students' Union
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                The Official Voice of{" "}
                <span
                  className="text-brand-gold"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "hsl(40 80% 60% / 0.35)",
                    textUnderlineOffset: "6px",
                  }}
                >
                  KWASU Students
                </span>
              </h1>
              <p className="text-brand-200 text-sm leading-relaxed mb-8 max-w-md">
                Advocacy, welfare, and community — everything your Students' Union does for every student at Kwara State University.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  to="/news"
                  id="hero-cta-news"
                  className="inline-flex items-center gap-2 bg-brand-gold text-brand-900 font-bold text-sm px-5 py-2.5 rounded hover:bg-brand-gold/90 transition-colors"
                >
                  Explore News
                  <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                </Link>
                <Link
                  to="/services"
                  id="hero-cta-services"
                  className="inline-flex items-center gap-2 border border-brand-700 text-brand-200 font-bold text-sm px-5 py-2.5 rounded hover:bg-brand-800 hover:text-white transition-colors"
                >
                  View Services
                </Link>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="relative max-w-sm">
                <i
                  className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400 text-xs"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search news, events, opportunities…"
                  className="w-full bg-brand-800 border border-brand-700 text-white text-sm placeholder:text-brand-400 pl-9 pr-20 py-2.5 rounded focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  id="hero-search"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-brand-900 bg-brand-gold hover:bg-brand-gold/90 px-3 py-1 rounded transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right: Campus photo slider (desktop only) */}
            <div className="hidden lg:block w-full max-w-sm ml-auto">
              <CampusPhotoSlider images={heroImages} interval={5000} />
            </div>

          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS BAR ─────────────────────────────────────────────── */}
      <QuickLinks />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left column: News feed (takes 2/3 on desktop) ─────────── */}
          <div className="lg:col-span-2 space-y-12">
            <NewsFeedSection limit={4} />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Executive council strip */}
            <ExecutiveProfilesSection />
          </div>

          {/* ── Right column: Events + Spotlight ──────────────────────── */}
          <div className="lg:col-span-1 space-y-10">
            <EventsCalendarSection />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Student Spotlight */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.15em] mb-0.5">
                    Featured
                  </p>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">
                    Student Spotlight
                  </h2>
                </div>
                <Link
                  to="/spotlight"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  View all <i className="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true" />
                </Link>
              </div>

              {spotlightLoading ? (
                <div className="border border-gray-100 rounded p-4 space-y-3 bg-white">
                  <Skeleton className="h-40 w-full rounded" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ) : spotlight ? (
                <SpotlightCard spotlight={spotlight} />
              ) : (
                <div className="py-10 text-center text-xs text-gray-400 border border-gray-100 rounded bg-white">
                  <i className="fa-solid fa-star text-2xl text-gray-200 mb-2" />
                  <p>No spotlight featured yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── SERVICES STRIP ───────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-brand-900 border-t border-brand-800 mt-8"
        aria-label="Student services"
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(150 60% 80%) 39px, hsl(150 60% 80%) 40px)",
          }}
          aria-hidden="true"
        />

        <div className="container relative py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold text-brand-300 uppercase tracking-[0.15em] mb-0.5">
                Union Ventures & Support
              </p>
              <h2 className="text-lg font-bold text-white leading-snug">
                Student Services
              </h2>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              All services <i className="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {serviceItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                id={`service-strip-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col border border-brand-800 rounded p-4 bg-brand-800/60 hover:border-brand-gold/50 hover:bg-brand-800 transition-all duration-150"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-brand-gold/10 text-brand-gold mb-3">
                  <i className={`${item.icon} text-sm`} aria-hidden="true" />
                </div>
                <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                <p className="text-xs text-brand-200 leading-relaxed flex-grow">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold mt-3 group-hover:text-brand-gold/80 transition-colors">
                  Access <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;