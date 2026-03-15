"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-700">News Management</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Manage articles for the student portal.</p>
        </div>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg w-full sm:w-auto">
          <Link to="/admin/news/add">
            <PlusCircle className="mr-2 h-4 w-4" /> New Article
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchNews} className="mt-4">Try Again</Button>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground text-lg">No news articles found.</p>
            <Button asChild variant="link" className="mt-2 text-brand-500">
              <Link to="/admin/news/add">Create your first article</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="group relative bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-3 md:p-4 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3 md:gap-4"
              >
                {/* Compact Image */}
                <div className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {article.coverUrl ? (
                    <img src={article.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-slate-300" />
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.tags && article.tags.length > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                        {article.tags[0]}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : "Draft"}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 truncate leading-snug group-hover:text-brand-600 transition-colors">
                    {article.title}
                  </h3>
                </div>
                
                {/* Compact Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg">
                    <Link to={`/admin/news/edit/${article.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={deletingId === article.id}
                        className="h-8 w-8 md:h-10 md:w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl max-w-[95vw] md:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete news article?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove "{article.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(article)} 
                          className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
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