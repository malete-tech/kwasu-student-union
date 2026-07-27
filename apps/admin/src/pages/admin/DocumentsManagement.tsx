"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, FileText, Download, AlertCircle } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Document Vault
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">({documents.length})</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Resources & institutional archives</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap">
          <Link to="/documents/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Upload
          </Link>
        </Button>
      </div>

      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchDocuments} className="mt-4 rounded-xl border-brand-100">Try Again</Button>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No documents uploaded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Upload resources for students to download</p>
            </div>
            <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-8 px-4 text-sm mt-1">
              <Link to="/documents/add">
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Upload Document
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {documents.map((document) => (
              <div key={document.id} className="flex flex-col sm:flex-row sm:items-center">
                {/* Content */}
                <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-md bg-brand-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      {document.fileType && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                          {document.fileType}
                        </span>
                      )}
                      {document.fileSize && (
                        <span className="text-[11px] text-slate-400">{document.fileSize}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">{document.title}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {document.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors shrink-0"
                    aria-label="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs">
                    <Link to={`/documents/edit/${document.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === document.id}
                        className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                      >
                        {deletingId === document.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete</>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">Delete document?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          This will permanently remove "{document.title}" and its file from storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(document)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
                        >
                          Delete Document
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsManagement;
