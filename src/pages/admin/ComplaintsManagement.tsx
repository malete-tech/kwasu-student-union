"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Filter, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Complaint, ComplaintStatus, ComplaintCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<ComplaintStatus, string> = {
  'Queued': 'bg-yellow-500 hover:bg-yellow-600',
  'In Review': 'bg-blue-500 hover:bg-blue-600',
  'Resolved': 'bg-green-500 hover:bg-green-600',
  'Closed': 'bg-gray-500 hover:bg-gray-600',
};

const complaintCategories: ComplaintCategory[] = ['Welfare', 'Academics', 'Fees', 'Security', 'Other'];
const complaintStatuses: ComplaintStatus[] = ['Queued', 'In Review', 'Resolved', 'Closed'];

const ComplaintsManagement: React.FC = () => {
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'All'>('All');

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.complaints.getAll();
      setAllComplaints(data);
      setFilteredComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to load complaints. Please ensure you have the necessary admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let currentComplaints = allComplaints;

    if (statusFilter !== 'All') {
      currentComplaints = currentComplaints.filter(c => c.status === statusFilter);
    }

    if (categoryFilter !== 'All') {
      currentComplaints = currentComplaints.filter(c => c.category === categoryFilter);
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      currentComplaints = currentComplaints.filter(c =>
        c.title.toLowerCase().includes(lowerCaseSearch) ||
        c.description.toLowerCase().includes(lowerCaseSearch) ||
        c.id.toLowerCase().includes(lowerCaseSearch)
      );
    }

    setFilteredComplaints(currentComplaints);
  }, [searchTerm, statusFilter, categoryFilter, allComplaints]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-700">Complaints Management</h2>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Review Student Complaints ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or ID..."
                className="pl-9 pr-3 py-2 rounded-md border focus-visible:ring-brand-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={(value: ComplaintStatus | 'All') => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px] focus-visible:ring-brand-gold">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {complaintStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={(value: ComplaintCategory | 'All') => setCategoryFilter(value)}>
                <SelectTrigger className="w-[180px] focus-visible:ring-brand-gold">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {complaintCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-center text-lg">{error}</div>
          ) : filteredComplaints.length === 0 ? (
            <p className="text-center text-muted-foreground">No complaints found matching your criteria.</p>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4 flex-1 min-w-0 mb-2 sm:mb-0">
                    <div className="p-2 rounded-full bg-brand-100 text-brand-700 flex-shrink-0">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-brand-800 truncate">{complaint.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        ID: {complaint.id.substring(0, 8)} &bull; Filed: {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                          {complaint.category}
                        </Badge>
                        <Badge className={statusColors[complaint.status]}>
                          {complaint.status}
                        </Badge>
                        {complaint.isAnonymous && (
                          <Badge variant="destructive">Anonymous</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-2 sm:mt-0">
                    <Button asChild size="sm" className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
                      <Link to={`/admin/complaints/${complaint.id}`}>
                        Review <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsManagement;