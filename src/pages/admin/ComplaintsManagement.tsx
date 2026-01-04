"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Filter, ArrowRight, Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { Complaint, ComplaintStatus, ComplaintCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusColors: Record<ComplaintStatus, string> = {
  'Queued': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
  'In Review': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  'Resolved': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  'Closed': 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">Student Grievances</h2>
          <p className="text-muted-foreground mt-1">
            Review and manage reports filed by students across campus.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-10 px-4 rounded-xl border-brand-100 bg-brand-50/30 text-brand-700 text-sm font-semibold">
            {filteredComplaints.length} Total Cases
           </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
          <Input
            placeholder="Search grievances by title, description or ID..."
            className="pl-11 h-12 rounded-xl border-brand-100 bg-white shadow-sm focus-visible:ring-brand-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={(value: ComplaintStatus | 'All') => setStatusFilter(value)}>
            <SelectTrigger className="w-[160px] h-12 rounded-xl bg-white border-brand-100 focus-visible:ring-brand-gold">
              <Filter className="h-4 w-4 mr-2 text-brand-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Statuses</SelectItem>
              {complaintStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value: ComplaintCategory | 'All') => setCategoryFilter(value)}>
            <SelectTrigger className="w-[160px] h-12 rounded-xl bg-white border-brand-100 focus-visible:ring-brand-gold">
              <Filter className="h-4 w-4 mr-2 text-brand-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Categories</SelectItem>
              {complaintCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchComplaints} className="mt-4 rounded-xl">Try Again</Button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
            <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7 text-brand-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No grievances found</h3>
            <p className="text-muted-foreground">Adjust your filters or search term to find what you're looking for.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setStatusFilter("All"); setCategoryFilter("All"); }} className="mt-2 text-brand-600">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredComplaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/50 hover:bg-white border border-transparent hover:border-brand-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-5 flex-1 min-w-0">
                  <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate text-lg">{complaint.title}</h3>
                      {complaint.isAnonymous && (
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter border-red-100 bg-red-50 text-red-600">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500">
                      <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                        #{complaint.id.substring(0, 8)}
                      </span>
                      <span>Filed {format(new Date(complaint.createdAt), "MMM dd, yyyy")}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="font-medium text-brand-700">{complaint.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0 flex-shrink-0">
                  <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-semibold text-xs border transition-colors", statusColors[complaint.status])}>
                    {complaint.status}
                  </Badge>
                  <Button asChild className="bg-white border border-brand-100 text-brand-700 hover:bg-brand-50 hover:text-brand-800 rounded-xl px-5 h-10 shadow-sm">
                    <Link to={`/admin/complaints/${complaint.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsManagement;