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
  Queued: "bg-amber-50 text-amber-700 border-amber-200",
  "In Review": "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const complaintCategories: ComplaintCategory[] = ["Welfare", "Academics", "Fees", "Security", "Other"];
const complaintStatuses: ComplaintStatus[] = ["Queued", "In Review", "Resolved", "Closed"];

const ComplaintsManagement: React.FC = () => {
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "All">("All");

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.complaints.getAll();
      setAllComplaints(data);
      setFilteredComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to load complaints. Please ensure you have admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let current = allComplaints;
    if (statusFilter !== "All") current = current.filter((c) => c.status === statusFilter);
    if (categoryFilter !== "All") current = current.filter((c) => c.category === categoryFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      current = current.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }
    setFilteredComplaints(current);
  }, [searchTerm, statusFilter, categoryFilter, allComplaints]);

  const hasActiveFilters = statusFilter !== "All" || categoryFilter !== "All" || searchTerm;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Complaints
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({filteredComplaints.length}
                {allComplaints.length !== filteredComplaints.length && ` of ${allComplaints.length}`})
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Student grievances & feedback</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search complaints..."
            className="pl-9 h-9 rounded-md border-slate-200 bg-white text-sm focus-visible:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: ComplaintStatus | "All") => setStatusFilter(value)}
          >
            <SelectTrigger className="h-9 rounded-md bg-white border-slate-200 text-sm w-[140px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectItem value="All">All Statuses</SelectItem>
              {complaintStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value: ComplaintCategory | "All") => setCategoryFilter(value)}
          >
            <SelectTrigger className="h-9 rounded-md bg-white border-slate-200 text-sm w-[140px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              <SelectItem value="All">All Categories</SelectItem>
              {complaintCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters strip */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Filters:</span>
          {statusFilter !== "All" && (
            <button
              onClick={() => setStatusFilter("All")}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium hover:bg-brand-100 transition-colors"
            >
              {statusFilter} ×
            </button>
          )}
          {categoryFilter !== "All" && (
            <button
              onClick={() => setCategoryFilter("All")}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium hover:bg-brand-100 transition-colors"
            >
              {categoryFilter} ×
            </button>
          )}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium hover:bg-brand-100 transition-colors"
            >
              "{searchTerm}" ×
            </button>
          )}
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("All"); setCategoryFilter("All"); }}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* List */}
      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[78px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-slate-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchComplaints} className="mt-3 rounded-md h-8 text-sm">
              Try Again
            </Button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No complaints found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {hasActiveFilters ? "Adjust your filters to see more results" : "No student complaints submitted yet"}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(""); setStatusFilter("All"); setCategoryFilter("All"); }}
                className="rounded-md h-8 text-sm border-slate-200"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="flex flex-col sm:flex-row sm:items-center">
                {/* Content */}
                <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-md bg-brand-50 flex items-center justify-center mt-0.5">
                    <MessageSquare className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wide border px-1.5 py-0 h-4",
                          statusColors[complaint.status]
                        )}
                      >
                        {complaint.status}
                      </Badge>
                      <span className="text-[10px] font-medium text-brand-600">
                        {complaint.category}
                      </span>
                      {complaint.isAnonymous && (
                        <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0 rounded border border-red-100">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">{complaint.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">
                        #{complaint.id.substring(0, 8)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs"
                  >
                    <Link to={`/complaints/${complaint.id}`}>
                      View Details
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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
