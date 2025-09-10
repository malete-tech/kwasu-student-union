"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { Card } from "@/components/ui/card"; // Removed CardContent, CardHeader, CardTitle
import { Button } from "@/components/ui/button";
import { FileText, Download, Search } from "lucide-react"; // Removed Tag
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"; // Added format import

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
      currentDocuments = currentDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredDocuments(currentDocuments);
  }, [searchTerm, activeTag, allDocuments]);

  const uniqueTags = Array.from(new Set(allDocuments.flatMap(doc => doc.tags)));

  return (
    <>
      <Helmet>
        <title>Downloads | KWASU Students' Union</title>
        <meta name="description" content="Download important documents, forms, and handbooks from KWASU Students' Union." />
      </Helmet>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-700">Important Downloads</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 pr-3 py-2 rounded-md border focus-visible:ring-brand-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={activeTag === null ? "default" : "secondary"}
              className={activeTag === null ? "bg-brand-500 text-white hover:bg-brand-600 cursor-pointer" : "bg-brand-100 text-brand-700 hover:bg-brand-200 cursor-pointer"}
              onClick={() => setActiveTag(null)}
            >
              All
            </Badge>
            {uniqueTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "secondary"}
                className={activeTag === tag ? "bg-brand-500 text-white hover:bg-brand-600 cursor-pointer" : "bg-brand-100 text-brand-700 hover:bg-brand-200 cursor-pointer"}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-lg rounded-xl">
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-lg">{error}</div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Button
                key={doc.id}
                asChild
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 px-5 border-brand-300 hover:bg-brand-50 focus-visible:ring-brand-gold"
              >
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <FileText className="mr-4 h-6 w-6 text-brand-500" />
                  <div className="flex-grow">
                    <span className="block font-medium text-lg text-brand-800">{doc.title}</span>
                    <span className="block text-sm text-muted-foreground">{doc.fileType} &bull; {doc.fileSize} &bull; Updated: {format(new Date(doc.updatedAt), "PPP")}</span>
                  </div>
                  <Download className="ml-auto h-6 w-6 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No documents found matching your criteria.</p>
        )}
      </div>
    </>
  );
};

export default DownloadsPage;