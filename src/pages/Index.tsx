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
import { CheckCircle, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import AnimatedNotifications from "@/components/AnimatedNotifications";
import PhoneMockup from "@/components/PhoneMockup";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Index = () => {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(""); // State for the input value
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSpotlights = await api.spotlight.getAll();
        setSpotlights(fetchedSpotlights.slice(0, 1)); // Limit to 1 for the homepage spotlight
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

  return (
    <>
      <Helmet>
        <title>Home | KWASU Students' Union</title>
        <meta name="description" content="Official website of KWASU Students' Union. Stay updated with news, events, and student services." />
      </Helmet>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-brand-900 to-brand-neon py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center rounded-full bg-brand-neon/20 px-3 py-1 text-sm font-medium text-white mb-4">
                <CheckCircle className="h-4 w-4 mr-2" /> Your Voice, Your Future
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Empower Your Future with <span className="text-brand-neon">KWASU SU</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-xl">
                Connecting students with opportunities, support, and a vibrant campus community.
              </p>

              {/* Search Input Form */}
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-300" />
                <Input
                  type="text"
                  placeholder="Search news, events, opportunities..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-brand-700 bg-brand-800 text-white placeholder:text-brand-300 focus-visible:ring-brand-gold focus-visible:border-brand-neon shadow-sm"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
                <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-neon hover:bg-brand-neon/90 text-white px-6 py-2 focus-visible:ring-brand-gold">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-4">
                <div className="flex items-center gap-2 text-brand-100">
                  <CheckCircle className="h-5 w-5 text-brand-gold" />
                  <span className="font-medium">Advocacy</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <CheckCircle className="h-5 w-5 text-brand-gold" />
                  <span className="font-medium">Community</span>
                </div>
                <div className="flex items-center gap-2 text-brand-100">
                  <CheckCircle className="h-5 w-5 text-brand-gold" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
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

            {/* Right Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ExecutiveProfilesSection />
              <NewsFeedSection />
              <EventsCalendarSection />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;