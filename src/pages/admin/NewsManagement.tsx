"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
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

const NewsManagement: React.FC = () => {
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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.news.delete(id);
      toast.success("News article deleted successfully!");
      setNewsArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Failed to delete news article:", error);
      toast.error("Failed to delete news article. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-700">News Management</h2>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
          <Link to="/admin/news/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg rounded-xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-brand-700">Manage News Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  {/* Removed Skeleton for cover image */}
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
          ) : newsArticles.length === 0 ? (
            <p className="text-center text-muted-foreground">No news articles found. Start by adding a new one!</p>
          ) : (
            <div className="space-y-4">
              {newsArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    {/* Removed article.coverUrl image display */}
                    <div>
                      <h3 className="font-semibold text-brand-800">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Published:{" "}
                        {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime())
                          ? format(new Date(article.publishedAt), "PPP")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="icon" className="text-brand-500 hover:bg-brand-50 focus-visible:ring-brand-gold">
                      <Link to={`/admin/news/edit/${article.slug}`}> {/* Link to the edit page */}
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={deletingId === article.id}>
                          {deletingId === article.id ? (
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
                            This action cannot be undone. This will permanently delete the news article
                            "{article.title}" from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive hover:bg-destructive/90">
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

export default NewsManagement;