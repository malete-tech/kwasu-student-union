import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { News, Event, StudentSpotlight } from "@/types";
import NewsCard from "@/components/news-card";
import EventCard from "@/components/event-card";
import StudentSpotlightCard from "@/components/student-spotlight-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardTitle
import QuickLinks from "@/components/QuickLinks";
import AnnouncementCard from "@/components/AnnouncementCard";
import ExecutiveProfilesSection from "@/components/ExecutiveProfilesSection";
import NewsFeedSection from "@/components/NewsFeedSection";
import EventsCalendarSection from "@/components/EventsCalendarSection";
import { Megaphone, BookOpen } from "lucide-react";

const Index = () => {
  const [studentSpotlights, setStudentSpotlights] = useState<StudentSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotlights = await api.studentSpotlight.getAll();
        setStudentSpotlights(spotlights.slice(0, 1)); // Limit to 1 for the homepage spotlight
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | KWASU Students' Union</title>
        <meta name="description" content="Official website of KWASU Students' Union. Stay updated with news, events, and student services." />
      </Helmet>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section
          className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder-hero.jpg')" }} // Placeholder background image
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-700/80 to-brand-900/60"></div> {/* Dark overlay */}
          <div className="relative z-10 text-white text-center max-w-6xl mx-auto py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-left px-4">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                Your Voice, Your Union, Your Future
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Empowering students for a better university experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-900 px-8 py-6 text-lg font-semibold focus-visible:ring-white">
                  <Link to="/about">Join Now</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold focus-visible:ring-white">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-4 mt-8 lg:mt-0">
              <AnnouncementCard
                title="New Study Spaces Opening Soon!"
                description="Modern and conducive environments for your academic success."
                icon={BookOpen}
                className="bg-white/90 text-brand-900"
              />
              <AnnouncementCard
                title="Volunteer Opportunities Available"
                description="Make a difference and gain valuable experience."
                icon={Megaphone}
                className="bg-white/90 text-brand-900"
              />
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <QuickLinks />
              {/* Student Spotlight */}
              <Card className="shadow-lg rounded-2xl p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-brand-700">Student Spotlight</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : error ? (
                    <div className="text-destructive text-sm text-center">{error}</div>
                  ) : studentSpotlights.length > 0 ? (
                    <StudentSpotlightCard spotlight={studentSpotlights[0]} />
                  ) : (
                    <p className="text-center text-muted-foreground text-sm">No student spotlight yet.</p>
                  )}
                </CardContent>
              </Card>
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