"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const EventsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-700">Events Management</h2>
        <Button className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is where you will create, edit, and delete events.
            The interface for managing events will be built here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManagement;