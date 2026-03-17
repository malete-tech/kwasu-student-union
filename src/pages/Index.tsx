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
import FadeIn from "@/components/FadeIn";
import { motion } from "framer-motion";

const Index = () => {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
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

  return (
    <>
      <Helmet>
        <title>KWASU Students' Union | Official Hub for News, Events & Advocacy</title>
        <meta name="description" content="Stay connected with the Kwara State University Students' Union. Access official news, upcoming campus events, executive profiles, and essential student services." />
      </Helmet>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-brand-900 to-brand-neon py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" duration={0.8}>
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

                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mb-8 group">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 transition-colors group-focus-within:text-brand-gold"></i>
                  <Input
                    type="text"
                    placeholder="Search news, events, opportunities..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-brand-700 bg-brand-800 text-white placeholder:text-brand-300 focus-visible:ring-brand-gold focus-visible:border-brand-neon shadow-sm transition-all"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                  <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-neon hover:bg-brand-neon/90 text-white px-6 py-2 focus-visible:ring-brand-gold">
                    <i className="fa-solid fa-arrow-right"></i>
                  </Button>
                </form>

                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-4">
                  {['Advocacy', 'Community', 'Opportunities'].map((feature, i) => (
                    <motion.div 
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-center gap-2 text-brand-100"
                    >
                      <i className="fa-solid fa-circle-check text-brand-gold"></i>
                      <span className="font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" duration={0.8} delay={0.2}>
              <div className="relative flex justify-center lg:justify-end">
                <PhoneMockup className="relative z-20">
                  <AnimatedNotifications className="absolute inset-0 p-4" />
                </PhoneMockup>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="container py-12">
          <FadeIn>
            <div className="mb-16">
              <NewsFeedSection />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <FadeIn delay={0.1}>
                <QuickLinks />
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="space-y-6">
                  <div className="pb-4 flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold text-brand-700">Spotlight</h2>
                    <Button asChild variant="link" size="sm" className="text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
                      <Link to="/spotlight">View All</Link>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {loading ? (
                      <Skeleton className="h-64 w-full rounded-2xl" />
                    ) : spotlights.length > 0 ? (
                      <SpotlightCard spotlight={spotlights[0]!} />
                    ) : (
                      <p className="text-center text-muted-foreground text-sm">No spotlight yet.</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-2 space-y-12">
              <FadeIn delay={0.3}>
                <ExecutiveProfilesSection />
              </FadeIn>
              <FadeIn delay={0.4}>
                <EventsCalendarSection />
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;