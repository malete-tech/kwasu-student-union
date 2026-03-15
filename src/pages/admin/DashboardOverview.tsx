"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Newspaper, CalendarDays, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const DashboardOverview: React.FC = () => {
  const [totalNews, setTotalNews] = useState<number | null>(null);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState<number | null>(null);
  const [activeExecutivesCount, setActiveExecutivesCount] = useState<number | null>(null);
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<Array<{ type: 'news' | 'event'; title: string; date: string; link: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const newsData = await api.news.getAll();
        setTotalNews(newsData.length);

        const eventsData = await api.events.getUpcoming(100);
        setUpcomingEventsCount(eventsData.length);

        const executivesData = await api.executives.getAll();
        setActiveExecutivesCount(executivesData.length);

        // Fetch pending complaints count (status 'Queued')
        const { count, error: complaintsError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Queued');
        
        if (complaintsError) throw complaintsError;
        setPendingComplaintsCount(count);

        const latestNews = await api.news.getLatest(3);
        const nextEvents = await api.events.getUpcoming(2);

        const combinedActivities = [
          ...latestNews.map(n => ({
            type: 'news' as const,
            title: n.title,
            date: n.publishedAt,
            link: `/admin/news/edit/${n.id}`
          })),
          ...nextEvents.map(e => ({
            type: 'event' as const,
            title: e.title,
            date: e.startsAt,
            link: `/admin/events/edit/${e.slug}`
          }))
        ];

        combinedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setRecentActivities(combinedActivities.slice(0, 5));

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-700">Welcome to the Admin Dashboard!</h2>
      <p className="text-muted-foreground">
        Here you can manage all aspects of the KWASU Students' Union website.
      </p>

      {error && (
        <div className="text-destructive text-center text-lg p-4 border border-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{totalNews !== null ? totalNews : "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Student updates</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{upcomingEventsCount !== null ? upcomingEventsCount : "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Live & upcoming</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Executives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{activeExecutivesCount !== null ? activeExecutivesCount : "N/A"}</div>
            )}
            <p className="text-xs text-muted-foreground">Current tenure</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{pendingComplaintsCount !== null ? pendingComplaintsCount : "0"}</div>
            )}
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg rounded-xl p-6">
        <CardTitle className="text-xl font-semibold mb-4 text-brand-700">Recent Activity</CardTitle>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {recentActivities.map((activity, index) => (
                <li key={index}>
                  <Link to={activity.link} className="text-brand-500 hover:underline">
                    {activity.type === 'news' ? "News Update:" : "Event Update:"} {activity.title}
                  </Link>
                  <span className="ml-2 text-xs text-gray-500">
                    ({format(new Date(activity.date), "MMM dd, yyyy")})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;