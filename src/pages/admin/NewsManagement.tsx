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
          <div className="grid gap-4 sm:grid-cols-1">
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
          <div className="grid gap-4">
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="group relative bg-white border border-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden flex flex-col sm:flex-row sm:items-center"
              >
                {/* Image and Content Wrapper */}
                <div className="flex flex-1 items-start p-4 gap-4">
                  {/* Image */}
                  <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {article.coverUrl ? (
                      <img src={article.coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {article.tags && article.tags.length > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          {article.tags[0]}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : "Draft"}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>
                
                {/* Actions Section */}
                <div className="flex items-center justify-end gap-2 p-3 sm:p-4 bg-slate-50/50 sm:bg-transparent border-t sm:border-t-0 border-slate-100">
                  <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none h-9 rounded-xl bg-white border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200">
                    <Link to={`/admin/news/edit/${article.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={deletingId === article.id}
                        className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent sm:border-none"
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl w-[95vw] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete news article?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove "{article.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="rounded-xl mt-0">Cancel</AlertDialogCancel>
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