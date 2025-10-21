"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, FileText, Download } from "lucide-react";
import { api } from "@/lib/api";
import { Document } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const DocumentsManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.documents.getAll();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const deleteFileFromStorage = async (url: string): Promise<boolean> => {
    if (!url) return true;

    const bucketName = "documents"; // Assuming 'documents' is your bucket name
    const pathSegments = url.split('/');
    const fileNameWithFolder = pathSegments.slice(pathSegments.indexOf(bucketName) + 1).join('/');

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileNameWithFolder]);

    if (deleteError) {
      console.error("Error deleting file from storage:", deleteError);
      toast.error(`File deletion from storage failed: ${deleteError.message}`);
      return false;
    }
    return true;
  };

  const handleDelete = async (document: Document) => {
    setDeletingId(document.id);
    try {
      // First, delete the file from Supabase Storage
      const fileDeleted = await deleteFileFromStorage(document.url);
      if (!fileDeleted) {
        throw new Error("Failed to delete file from storage.");
      }

      // Then, delete the document record from the database
      await api.documents.delete(document.id);
      toast.success("Document deleted successfully!");
      setDocuments((prev) => prev.filter((doc) => doc.id !== document.id));
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-700">Documents Management</h2>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <Link to="/admin/documents/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Upload New Document
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-4 sm:p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage Downloadable Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-center text-lg">{error}</div>
          ) : documents.length === 0 ? (
            <p className="text-center text-muted-foreground">No documents found. Start by uploading a new one!</p>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-start space-x-4 flex-1 min-w-0 mb-2 sm:mb-0">
                    <div className="p-2 rounded-md bg-brand-100 text-brand-700 flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-brand-800 truncate">{document.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {document.fileType} &bull; {document.fileSize} &bull; Updated: {format(new Date(document.updatedAt), "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <a href={document.url} target="_blank" rel="noopener noreferrer" aria-label="Download Document">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <Link to={`/admin/documents/edit/${document.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={deletingId === document.id}>
                          {deletingId === document.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the document
                            "{document.title}" and its associated file from storage.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(document)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default DocumentsManagement;