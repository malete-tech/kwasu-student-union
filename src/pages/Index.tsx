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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import QuickLinks from "@/components/QuickLinks";
import ExecutiveProfilesSection from "@/components/ExecutiveProfilesSection";
import NewsFeedSection from "@/components/NewsFeedSection";
import EventsCalendarSection from "@/components/EventsCalendarSection";
import { CheckCircle, Search, ArrowRight, BarChart2, BookOpen } from "lucide-react"; // Added new icons
import { Input } from "@/components/ui/input"; // Added Input component

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
        <section className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-start text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 mb-4">
                <CheckCircle className="h-4 w-4 mr-2" /> Your Voice, Your Future
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Empower Your Future with <span className="text-brand-700">KWASU SU</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                Connecting students with opportunities, support, and a vibrant campus community.
              </p>

              {/* Search Input */}
              <div className="relative w-full max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news, events, opportunities..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus-visible:ring-brand-gold focus-visible:border-brand-500 shadow-sm"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 focus-visible:ring-brand-gold">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-brand-500" />
                  <span className="font-medium">Advocacy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-brand-500" />
                  <span className="font-medium">Community</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-brand-500" />
                  <span className="font-medium">Opportunities</span>
                </div>
              </div>
            </div>

            {/* Right Image with Overlays */}
            <div className="relative flex justify-center lg:justify-end">
              <img
                src="/pasted-image-2025-09-10T16-26-11-583Z.png" // Updated image source
                alt="Students collaborating" // Updated alt text
                className="relative z-10 w-full max-w-lg rounded-3xl shadow-2xl object-cover"
              />
              {/* Overlay 1: No of students chart */}
              <div className="absolute top-10 left-1/2 lg:left-auto lg:right-0 -translate-x-1/2 lg:translate-x-1/4 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[150px] z-20">
                <span className="text-sm text-gray-500 mb-2">No of students</span>
                <div className="flex gap-1 h-10 items-end">
                  <div className="w-3 bg-blue-500 rounded-sm h-1/2"></div>
                  <div className="w-3 bg-purple-500 rounded-sm h-3/4"></div>
                  <div className="w-3 bg-green-500 rounded-sm h-full"></div>
                  <div className="w-3 bg-yellow-500 rounded-sm h-2/3"></div>
                </div>
              </div>
              {/* Overlay 2: Available courses badge */}
              <div className="absolute bottom-10 left-1/4 lg:left-auto lg:right-1/2 translate-x-1/2 lg:translate-x-1/2 bg-white p-3 rounded-xl shadow-lg flex items-center z-20">
                <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
                <span className="font-semibold text-gray-800">50+</span>
                <span className="text-sm text-gray-500 ml-1">Available courses</span>
              </div>
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