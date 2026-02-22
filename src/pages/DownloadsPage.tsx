"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DownloadsPage: React.FC = () => {
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await api.documents.getAll();
        setAllDocuments(data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        setFilteredDocuments(data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    let currentDocuments = allDocuments;

    if (activeTag) {
      currentDocuments = currentDocuments.filter(doc => doc.tags.includes(activeTag));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      currentDocuments = currentDocuments.filter(doc =>
        doc.title.toLowerCase().includes(lowerSearch) ||
        doc.fileType.toLowerCase().includes(lowerSearch) ||
        doc.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredDocuments(currentDocuments);
  }, [searchTerm, activeTag, allDocuments]);

  const uniqueTags = Array.from(new Set(allDocuments.flatMap(doc => doc.tags)));

  return (
    <>
      <Helmet>
        <title>Downloads | KWASU Students' Union</title>
      </Helmet>
      <div className="container py-12">
        <Button asChild variant="ghost" className="mb-8 text-brand-600 hover:text-brand-700 -ml-4">
          <Link to="/services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-brand-700">Important Downloads</h1>
        <p className="text-center text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Access official university handbooks, union constitutions, and essential student forms in the digital vault.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-5xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-300" />
            <Input
              placeholder="Search documents by title or tag..."
              className="h-12 pl-12 rounded-xl border-brand-100 focus-visible:ring-brand-gold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={activeTag === null ? "default" : "secondary"}
              className={cn(
                "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider",
                activeTag === null ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
              )}
              onClick={() => setActiveTag(null)}
            >
              All Files
            </Badge>
            {uniqueTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "secondary"}
                className={cn(
                  "h-10 px-4 rounded-xl cursor-pointer transition-all uppercase text-[10px] font-bold tracking-wider",
                  activeTag === tag ? "bg-brand-700 text-white" : "bg-white border-brand-100 text-brand-600 hover:bg-brand-50"
                )}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 rounded-2xl shadow-sm border-brand-50 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive font-medium">{error}</div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-brand-50 bg-white/50 hover:bg-white flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-900 line-clamp-2 leading-tight mb-1">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      {doc.fileType} • {doc.fileSize}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-brand-50 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground italic">
                    Updated: {format(new Date(doc.updatedAt), "MMM dd, yyyy")}
                  </span>
                  <Button asChild size="sm" variant="ghost" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      Download <Download className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            No documents found matching your search.
          </div>
        )}
      </div>
    </>
  );
};

export default DownloadsPage;