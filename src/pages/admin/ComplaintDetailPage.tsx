"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User, Mail, Phone, ListChecks, History } from "lucide-react";
import { api } from "@/lib/api";
import { Complaint, ComplaintStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Imported cn

const statusColors: Record<ComplaintStatus, string> = {
  'Queued': 'bg-yellow-500 hover:bg-yellow-600',
  'In Review': 'bg-blue-500 hover:bg-blue-600',
  'Resolved': 'bg-green-500 hover:bg-green-600',
  'Closed': 'bg-gray-500 hover:bg-gray-600',
};

const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus | undefined>(undefined);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchComplaint = async () => {
    if (!id) {
      setError("Complaint ID is missing.");
      setLoading(false);
      return;
    }
    try {
      const data = await api.complaints.getById(id);
      if (data) {
        setComplaint(data);
        setNewStatus(data.status);
      } else {
        setError("Complaint not found.");
      }
    } catch (err) {
      console.error("Failed to fetch complaint details:", err);
      setError("Failed to load complaint details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!complaint || !newStatus || newStatus === complaint.status) return;

    setIsUpdating(true);
    try {
      const updatedComplaint = await api.complaints.updateStatus(complaint.id, newStatus, statusNote || undefined);
      setComplaint(updatedComplaint);
      setStatusNote("");
      toast.success(`Complaint status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update complaint status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full lg:col-span-2" />
          <Skeleton className="h-96 w-full lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-brand-700">Complaint Details</h2>
        <Card className="shadow-lg rounded-xl p-6">
          <CardContent className="text-destructive text-center text-lg">
            {error || "Complaint data is not available."}
            <div className="mt-6">
              <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
                <Link to="/admin/complaints">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedTimeline = [...complaint.timeline].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      <Helmet>
        <title>Complaint #{complaint.id.substring(0, 8)} | Admin</title>
        <meta name="description" content={`Manage complaint: ${complaint.title}`} />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Complaint #{complaint.id.substring(0, 8)}</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/complaints">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content: Details and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Summary */}
            <Card className="shadow-lg rounded-xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-brand-700">{complaint.title}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <Badge className={statusColors[complaint.status]}>
                    Status: {complaint.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Filed: {format(new Date(complaint.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-2 text-brand-800">Category</h3>
                  <Badge variant="secondary" className="bg-brand-100 text-brand-700">{complaint.category}</Badge>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-2 text-brand-800">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg rounded-xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-brand-700 flex items-center">
                  <History className="h-6 w-6 mr-2" /> Complaint History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-gray-200 ml-4">
                  {sortedTimeline.map((entry) => (
                    <li key={entry.id} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-3 h-3 bg-brand-500 rounded-full -left-1.5 ring-8 ring-white"></span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                        Status Updated to: <Badge className={cn("ml-2", statusColors[entry.status])}>{entry.status}</Badge>
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                        {format(new Date(entry.timestamp), "MMM dd, yyyy HH:mm")}
                      </time>
                      {entry.note && (
                        <p className="text-base font-normal text-gray-500 italic">
                          Note: {entry.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Status Update and Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Update Card */}
            <Card className="shadow-lg rounded-xl p-6 bg-brand-50 border-brand-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-brand-700">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-status">New Status</Label>
                  <Select value={newStatus} onValueChange={(value: ComplaintStatus) => setNewStatus(value)}>
                    <SelectTrigger id="new-status" className="focus-visible:ring-brand-gold">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Queued', 'In Review', 'Resolved', 'Closed'].map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-note">Admin Note (Optional)</Label>
                  <Textarea
                    id="status-note"
                    placeholder="Add a note about this status change..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows={3}
                    className="focus-visible:ring-brand-gold"
                  />
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold"
                  disabled={isUpdating || newStatus === complaint.status}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ListChecks className="mr-2 h-4 w-4" />
                  )}
                  Update Complaint
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card className="shadow-lg rounded-xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-brand-700">Complainant Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-brand-500" />
                  <span className="font-medium">User ID:</span>
                  <span className="ml-2 text-sm text-gray-700">
                    {complaint.isAnonymous ? (
                      <Badge variant="destructive">Anonymous</Badge>
                    ) : complaint.userId ? (
                      complaint.userId.substring(0, 8) + "..."
                    ) : (
                      "N/A (Unauthenticated)"
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-brand-500" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-sm text-gray-700">
                    {complaint.contactEmail || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-brand-500" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2 text-sm text-gray-700">
                    {complaint.contactPhone || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetailPage;