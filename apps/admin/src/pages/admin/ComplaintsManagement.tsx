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
  'Queued': 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100',
  'In Review': 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100',
  'Resolved': 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100',
  'Closed': 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100',
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-brand-900 uppercase tracking-tight">Student Grievances</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Conflict Resolution & Feedback</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search grievances..."
            className="pl-11 h-11 md:h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 lg:flex gap-2">
          <Select value={statusFilter} onValueChange={(value: ComplaintStatus | 'All') => setStatusFilter(value)}>
            <SelectTrigger className="h-11 md:h-12 rounded-xl bg-white border-slate-200">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
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
            <SelectTrigger className="h-11 md:h-12 rounded-xl bg-white border-slate-200">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
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

      <div className="mt-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchComplaints} className="mt-4 rounded-xl">Try Again</Button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-slate-200">
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No grievances found</h3>
            <p className="text-sm text-slate-500">Adjust your filters or search term to find what you're looking for.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setStatusFilter("All"); setCategoryFilter("All"); }} className="mt-2 text-brand-600">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredComplaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className="group relative bg-white border border-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden flex flex-col md:flex-row md:items-center"
              >
                {/* Header/Info Section */}
                <div className="flex-1 p-4 md:p-5 flex items-start gap-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate text-base md:text-lg leading-tight">
                        {complaint.title}
                      </h3>
                      {complaint.isAnonymous && (
                        <Badge variant="outline" className="text-[10px] h-4 uppercase font-bold tracking-tighter border-red-100 bg-red-50 text-red-600 px-1">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        #{complaint.id.substring(0, 8)}
                      </span>
                      <span>{format(new Date(complaint.createdAt), "MMM d, yyyy")}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="font-semibold text-brand-600">{complaint.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions Section */}
                <div className="flex items-center justify-between md:justify-end gap-3 p-3 md:p-5 bg-slate-50/50 md:bg-transparent border-t md:border-t-0 border-slate-100">
                  <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide border transition-colors", statusColors[complaint.status])}>
                    {complaint.status}
                  </Badge>
                  
                  <Button asChild variant="outline" size="sm" className="h-9 rounded-xl bg-white border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-200 group/btn">
                    <Link to={`/complaints/${complaint.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
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
