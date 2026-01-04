"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Image } from "lucide-react";
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-700">News Management</h2>
          <p className="text-muted-foreground mt-1">Create, edit, and manage news articles for the platform.</p>
        </div>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold shadow-md">
          <Link to="/admin/news/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={fetchNews} className="mt-4">Try Again</Button>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground text-lg">No news articles found. Start by adding a new one!</p>
            <Button asChild variant="link" className="mt-2 text-brand-500">
              <Link to="/admin/news/add">Add your first article</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/50 hover:bg-white rounded-2xl border border-transparent hover:border-brand-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-brand-50 border border-brand-100 flex items-center justify-center shadow-inner">
                    {article.coverUrl ? (
                      <img src={article.coverUrl} alt="Cover" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <Image className="h-8 w-8 text-brand-200" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-800 group-hover:text-brand-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime())
                          ? format(new Date(article.publishedAt), "PPP")
                          : "Draft"}
                      </span>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-1">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full border border-brand-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button asChild variant="outline" size="sm" className="bg-white border-brand-100 text-brand-600 hover:bg-brand-50 hover:text-brand-700 rounded-xl px-4">
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
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl h-9 w-9"
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-brand-800">Delete article?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          This will permanently remove <span className="font-semibold text-brand-700">"{article.title}"</span> and its cover image. This action is irreversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl border-brand-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(article)} 
                          className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
                        >
                          Delete Article
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