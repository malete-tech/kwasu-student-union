"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import {
  Newspaper,
  CalendarDays,
  Users,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  Inbox,
  AlertCircle,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | null;
  loading: boolean;
  icon: React.ElementType;
  href: string;
  accentClass: string;
  iconBgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  loading,
  icon: Icon,
  href,
  accentClass,
  iconBgClass,
}) => (
  <Link
    to={href}
    className="group block bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-150"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-1.5" />
        ) : (
          <p className={`text-3xl font-bold mt-1 ${accentClass}`}>
            {value ?? "—"}
          </p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBgClass}`}>
        <Icon className={`w-5 h-5 ${accentClass}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
      <span>View all</span>
      <ArrowRight className="w-3 h-3" />
    </div>
  </Link>
);

const DashboardOverview: React.FC = () => {
  const [totalNews, setTotalNews] = useState<number | null>(null);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState<number | null>(null);
  const [activeExecutivesCount, setActiveExecutivesCount] = useState<number | null>(null);
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<
    Array<{ type: "news" | "event"; title: string; date: string; link: string }>
  >([]);
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

        const { count, error: complaintsError } = await supabase
          .from("complaints")
          .select("*", { count: "exact", head: true })
          .eq("status", "Queued");
        if (complaintsError) throw complaintsError;
        setPendingComplaintsCount(count);

        const latestNews = await api.news.getLatest(3);
        const nextEvents = await api.events.getUpcoming(2);

        const combinedActivities = [
          ...latestNews.map((n) => ({
            type: "news" as const,
            title: n.title,
            date: n.publishedAt,
            link: `/news/edit/${n.id}`,
          })),
          ...nextEvents.map((e) => ({
            type: "event" as const,
            title: e.title,
            date: e.startsAt,
            link: `/events/edit/${e.slug}`,
          })),
        ];
        combinedActivities.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
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

  const stats: StatCardProps[] = [
    {
      label: "News Articles",
      value: totalNews,
      loading,
      icon: Newspaper,
      href: "/news",
      accentClass: "text-brand-600",
      iconBgClass: "bg-brand-50",
    },
    {
      label: "Upcoming Events",
      value: upcomingEventsCount,
      loading,
      icon: CalendarDays,
      href: "/events",
      accentClass: "text-blue-600",
      iconBgClass: "bg-blue-50",
    },
    {
      label: "Active Executives",
      value: activeExecutivesCount,
      loading,
      icon: Users,
      href: "/executives",
      accentClass: "text-violet-600",
      iconBgClass: "bg-violet-50",
    },
    {
      label: "Pending Complaints",
      value: pendingComplaintsCount,
      loading,
      icon: MessageSquare,
      href: "/complaints",
      accentClass: "text-amber-600",
      iconBgClass: "bg-amber-50",
    },
  ];

  const quickActions = [
    { label: "Write Article", href: "/news/add", icon: Newspaper },
    { label: "Add Event", href: "/events/add", icon: CalendarDays },
    { label: "Add Executive", href: "/executives/add", icon: Users },
    { label: "View Complaints", href: "/complaints", icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
            >
              <PlusCircle className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="truncate">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Recent Activity
        </h2>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
              <Inbox className="w-8 h-8" />
              <p className="text-sm">No recent activity to display.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActivities.map((activity, index) => (
                <li key={index}>
                  <Link
                    to={activity.link}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors duration-100"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        activity.type === "news"
                          ? "bg-brand-50"
                          : "bg-blue-50"
                      }`}
                    >
                      {activity.type === "news" ? (
                        <Newspaper className="w-4 h-4 text-brand-600" />
                      ) : (
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.type === "news" ? "News" : "Event"} ·{" "}
                        {formatDistanceToNow(new Date(activity.date), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
