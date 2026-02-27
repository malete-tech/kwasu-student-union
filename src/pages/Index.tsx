import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Spotlight } from "@/types";
import SpotlightCard from "@/components/SpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import QuickLinks from "@/components/QuickLinks";
import ExecutiveProfilesSection from "@/components/ExecutiveProfilesSection";
import NewsFeedSection from "@/components/NewsFeedSection";
import EventsCalendarSection from "@/components/EventsCalendarSection";
import { Input } from "@/components/ui/input";
import AnimatedNotifications from "@/components/AnimatedNotifications";
import PhoneMockup from "@/components/PhoneMockup";
import { useNavigate, Link } from "react-router-dom";

const Index = () => {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSpotlights = await api.spotlight.getAll();
        setSpotlights(fetchedSpotlights.slice(0, 1));
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchTerm.trim())}`);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KWASU Students' Union",
    "url": "https://thekwasusu.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thekwasusu.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KWASU Students' Union",
    "url": "https://thekwasusu.com",
    "logo": "https://thekwasusu.com/logo.png",
    "sameAs": [
      "https://facebook.com/thekwasusu",
      "https://instagram.com/thekwasusu",
      "https://x.com/thekwasusu",
      "https://linkedin.com/company/thekwasusu"
    ]
  };

  return (
    <>
      <Helmet>
        <title>KWASU Students' Union | Official Hub for News, Events & Advocacy</title>
        <meta name="description" content="Stay connected with the Kwara State University Students' Union. Access official news, upcoming campus events, executive profiles, and essential student services." />
        <link rel="canonical" href="https://thekwasusu.com/" />
        <meta property="og:title" content="KWASU Students' Union | Official Hub" />
        <meta property="og:description" content="Official website of KWASU Students' Union. Stay updated with news, events, and student services." />
        <meta property="og:image" content="https://thekwasusu.com/logo.png" />
        <meta property="twitter:image" content="https://thekwasusu.com/logo.png" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(orgData)}</script>
      </Helmet>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-brand-900 to-brand-neon py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center rounded-full bg-brand-neon/20 px-3 py-1 text-sm font-medium text-white mb-4">
                <i className="fa-solid fa-circle-check mr-2"></i> Your Voice, Your Future
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Empower Your Future with <span className="text-brand-neon">KWASU SU</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-xl">
                Connecting students with opportunities, support, and a vibrant campus community.
              </p>

              {/* Search Input Form */}
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mb-8">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-300"></i>
                <Input
                  type="text"
                  placeholder="Search news, events, opportunities..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-brand-700 bg-brand-800 text-white placeholder:text-brand-300 focus-visible:ring-brand-gold focus-visible:border-brand-neon shadow-sm"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
                <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-neon hover:bg-brand-neon/90 text-white px-6 py-2 focus-visible:ring-brand-gold">
                  <i className="fa-solid fa-arrow-right"></i>
                </Button>
              </form>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-4">
                <div className="flex items-center gap-2 text-brand-100">
                  <i className="fa-solid fa-circle-check text-brand-gold"></i>
                  <span className="font-medium">Advocacy</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <i className="fa-solid fa-circle-check text-brand-gold"></i>
                  <span className="font-medium">Community</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <i className="fa-solid fa-circle-check text-brand-gold"></i>
                  <span className="font-medium">Opportunities</span>
                </div>
              </div>
            </div>

            {/* Right Phone Mockup with Animated Notifications */}
            <div className="relative flex justify-center lg:justify-end">
              <PhoneMockup className="relative z-20">
                <AnimatedNotifications className="absolute inset-0 p-4" />
              </PhoneMockup>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container py-12">
          {/* Latest News Feed - Prominent at the top */}
          <div className="mb-16">
            <NewsFeedSection />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar (Desktop) */}
            <div className="lg:col-span-1 space-y-8">
              <QuickLinks />
              {/* Spotlight */}
              <div className="space-y-6">
                <div className="pb-4 flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-semibold text-brand-700">Spotlight</h2>
                  <Button asChild variant="link" size="sm" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
                    <Link to="/spotlight">View All</Link>
                  </Button>
                </div>
                <div className="space-y-6">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : error ? (
                    <div className="text-destructive text-sm text-center">{error}</div>
                  ) : spotlights.length > 0 ? (
                    <SpotlightCard spotlight={spotlights[0]!} />
                  ) : (
                    <p className="text-center text-muted-foreground text-sm">No spotlight yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Main Content (Desktop) */}
            <div className="lg:col-span-2 space-y-8">
              <ExecutiveProfilesSection />
              <EventsCalendarSection />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;