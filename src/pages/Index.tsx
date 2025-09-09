import { MadeWithDyad } from "@/components/made-with-dyad";
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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; // Added missing import

const Index = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [studentSpotlights, setStudentSpotlights] = useState<StudentSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [news, events, spotlights] = await Promise.all([
          api.news.getLatest(3),
          api.events.getUpcoming(3),
          api.studentSpotlight.getAll(),
        ]);
        setLatestNews(news);
        setUpcomingEvents(events);
        setStudentSpotlights(spotlights.slice(0, 3)); // Limit to 3 for homepage
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
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-800 text-brand-900 dark:text-brand-50 p-4">
          <div className="text-center max-w-4xl mx-auto py-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Welcome to KWASU Students' Union
            </h1>
            <p className="text-xl md:text-2xl text-brand-700 dark:text-brand-200 mb-8">
              Your voice, our mission. Empowering students for a better university experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-6 text-lg focus-visible:ring-brand-500">
                <Link to="/services/complaints">Submit Complaint</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900 dark:hover:text-brand-300 px-8 py-6 text-lg focus-visible:ring-brand-500">
                <Link to="/events">Check Events</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900 dark:hover:text-brand-300 px-8 py-6 text-lg focus-visible:ring-brand-500">
                <Link to="/executives">View Executives</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Announcements Section */}
        <section className="container py-12 bg-background">
          <h2 className="text-3xl font-bold text-center mb-8">Latest Announcements</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden shadow-lg">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 pt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive text-lg">{error}</div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No announcements yet—check back soon.</p>
          )}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900 dark:hover:text-brand-300 px-6 py-3 focus-visible:ring-brand-500">
              <Link to="/news">View All Announcements</Link>
            </Button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="container py-12 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden shadow-lg">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 pt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive text-lg">{error}</div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((eventItem) => (
                <EventCard key={eventItem.id} event={eventItem} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No upcoming events yet—check back soon.</p>
          )}
          <div className="text-center mt-8">
            <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 focus-visible:ring-brand-500">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </section>

        {/* Student Spotlight Section */}
        <section className="container py-12 bg-background">
          <h2 className="text-3xl font-bold text-center mb-8">Student Spotlight</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden shadow-lg">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive text-lg">{error}</div>
          ) : studentSpotlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentSpotlights.map((spotlightItem) => (
                <StudentSpotlightCard key={spotlightItem.id} spotlight={spotlightItem} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No student spotlights yet—check back soon.</p>
          )}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900 dark:hover:text-brand-300 px-6 py-3 focus-visible:ring-brand-500">
              <Link to="/about">Learn More About Our Students</Link>
            </Button>
          </div>
        </section>

        <MadeWithDyad />
      </div>
    </>
  );
};

export default Index;