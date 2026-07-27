"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Image as ImageIcon, Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { News } from "@/types";
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
import { deleteImageFromCloudinary, getCloudinaryPublicId } from "@/utils/cloudinary-upload";
import { useSession } from "@/components/SessionContextProvider";

const NewsManagement: React.FC = () => {
  const { session } = useSession();
  const [newsArticles, setNewsArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.news.getAll();
      setNewsArticles(data);
    } catch (err) {
      console.error("Failed to fetch news articles:", err);
      setError("Failed to load news articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (article: News) => {
    if (!session?.access_token) {
      toast.error("Authentication token missing for deletion.");
      return;
    }
    setDeletingId(article.id);
    try {
      if (article.coverUrl) {
        const publicId = getCloudinaryPublicId(article.coverUrl);
        if (publicId) {
          const imageDeleted = await deleteImageFromCloudinary(publicId, session.access_token);
          if (!imageDeleted) {
            console.warn(`Failed to delete Cloudinary image for article ${article.id}. Proceeding with DB deletion.`);
          }
        }
      }
      await api.news.delete(article.id);
      toast.success("News article deleted successfully!");
      setNewsArticles((prev) => prev.filter((a) => a.id !== article.id));
    } catch (error) {
      console.error("Failed to delete news article:", error);
      toast.error("Failed to delete news article. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            News Articles
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({newsArticles.length})
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Editorial & press center</p>
        </div>
        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-9 px-4 text-sm whitespace-nowrap">
          <Link to="/news/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border border-slate-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchNews} className="mt-3 rounded-md h-8 text-sm">
              Try Again
            </Button>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-slate-200 rounded-lg bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No articles yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Publish your first news article</p>
            </div>
            <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white rounded-md h-8 px-4 text-sm mt-1">
              <Link to="/news/add">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                New Article
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
            {newsArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row sm:items-center"
              >
                {/* Content */}
                <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                    {article.coverUrl ? (
                      <img
                        src={article.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      {article.tags && article.tags.length > 0 && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                          {article.tags[0]}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {article.publishedAt
                          ? format(new Date(article.publishedAt), "MMM d, yyyy")
                          : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {article.title}
                    </p>
                  </div>
                </div>

                {/* Actions — full-width strip on mobile, inline on desktop */}
                <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:pr-4 border-t border-slate-100 sm:border-t-0 bg-slate-50/70 sm:bg-transparent">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none h-8 rounded-md border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50 text-xs"
                  >
                    <Link to={`/news/edit/${article.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === article.id}
                        className="flex-1 sm:flex-none h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg w-[90vw] max-w-md border-slate-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">Delete article?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          This will permanently remove "{article.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-md mt-0 h-9">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(article)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9"
                        >
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
      </div>
    </div>
  );
};

export default NewsManagement;
