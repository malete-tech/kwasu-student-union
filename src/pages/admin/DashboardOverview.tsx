"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Newspaper, CalendarDays, MessageSquare } from "lucide-react";

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-700">Welcome to the Admin Dashboard!</h2>
      <p className="text-muted-foreground">
        Here you can manage all aspects of the KWASU Students' Union website.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Executives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Current tenure</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg rounded-xl p-6">
        <CardTitle className="text-xl font-semibold mb-4 text-brand-700">Recent Activity</CardTitle>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>John Doe updated "KWASU SU Elections 2024" news article.</li>
            <li>New event "Freshers' Welcome Party" added by Jane Smith.</li>
            <li>Complaint #C-20241234 status changed to "In Review".</li>
            <li>New document "Revised Student Handbook" uploaded.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;