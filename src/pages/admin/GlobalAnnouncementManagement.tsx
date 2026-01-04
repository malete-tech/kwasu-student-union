"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Megaphone, Edit, Trash2, PlusCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface GlobalAnnouncement {
  id: string;
  title: string;
  messageMd: string;
  type: 'urgent' | 'celebration' | 'info';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const announcementTypes = ['info', 'urgent', 'celebration'] as const;

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  messageMd: z.string().min(10, { message: "Message content is required." }),
  type: z.enum(announcementTypes, { required_error: "Type is required." }),
  isActive: z.boolean().default(false),
});

const GlobalAnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<GlobalAnnouncement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      messageMd: "",
      type: 'info',
      isActive: false,
    },
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.announcements.getAll();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError("Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenDialog = (announcement?: GlobalAnnouncement) => {
    setEditingAnnouncement(announcement || null);
    if (announcement) {
      form.reset({
        title: announcement.title,
        messageMd: announcement.messageMd,
        type: announcement.type,
        isActive: announcement.isActive,
      });
    } else {
      form.reset({
        title: "",
        messageMd: "",
        type: 'info',
        isActive: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        messageMd: values.messageMd,
        type: values.type,
        isActive: values.isActive,
      };

      if (editingAnnouncement) {
        await api.announcements.update(editingAnnouncement.id, payload);
        toast.success("Announcement updated successfully!");
      } else {
        await api.announcements.create(payload);
        toast.success("Announcement created successfully!");
      }
      
      handleCloseDialog();
      await fetchAnnouncements(); // Refresh list
    } catch (error) {
      console.error("Failed to save announcement:", error);
      toast.error("Failed to save announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await api.announcements.delete(id);
      toast.success(`Announcement "${title}" deleted successfully!`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast.error("Failed to delete announcement. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (announcement: GlobalAnnouncement) => {
    setIsSubmitting(true);
    try {
      const newStatus = !announcement.isActive;
      await api.announcements.update(announcement.id, { isActive: newStatus });
      toast.success(`Announcement ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to toggle announcement status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconClasses = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-destructive group-hover:bg-destructive group-hover:text-white';
      case 'celebration':
        return 'bg-brand-gold/20 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-900';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white';
    }
  };

  return (
    <>
      <Helmet>
        <title>Global Announcements | KWASU SU Admin</title>
        <meta name="description" content="Manage site-wide popups and banners for urgent or celebratory messages." />
      </Helmet>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Global Announcements</h2>
            <p className="text-muted-foreground mt-1">
              Manage site-wide banners and modal messages for urgent or important notices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-brand-100 bg-brand-50/30 text-brand-700 text-sm font-semibold">
              {announcements.filter(a => a.isActive).length} Active
            </Badge>
            <Button onClick={() => handleOpenDialog()} className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-6 border rounded-2xl bg-white/50">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-destructive text-lg font-medium">{error}</p>
              <Button variant="outline" onClick={fetchAnnouncements} className="mt-4 rounded-xl border-brand-100">Try Again</Button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-white/30 border-brand-100">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                <Megaphone className="h-7 w-7 text-brand-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No announcements created yet</h3>
              <p className="text-muted-foreground">Create a new global message to display on the homepage.</p>
              <Button onClick={() => handleOpenDialog()} className="mt-6 bg-brand-500 hover:bg-brand-600 text-white rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Announcement
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className={cn(
                    "group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                    announcement.isActive 
                      ? "bg-white border-brand-200 shadow-lg" 
                      : "bg-white/50 hover:bg-white border-transparent hover:border-brand-100 hover:shadow-md shadow-sm opacity-80"
                  )}
                >
                  <div className="flex items-start space-x-5 flex-1 min-w-0">
                    <div className={cn(
                      "p-3.5 rounded-2xl flex-shrink-0 transition-colors duration-300",
                      getIconClasses(announcement.type)
                    )}>
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                        {announcement.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500">
                        <span className="font-medium text-brand-700 capitalize">{announcement.type}</span>
                        <span className="text-xs text-muted-foreground italic">• Updated: {format(new Date(announcement.updatedAt), "MMM dd, yyyy")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {announcement.messageMd.split('\n')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                    <Button 
                      variant={announcement.isActive ? "destructive" : "default"} 
                      size="sm" 
                      onClick={() => handleToggleActive(announcement)}
                      disabled={isSubmitting}
                      className={cn(
                        "h-10 px-4 rounded-xl shadow-sm",
                        announcement.isActive ? "bg-red-500 hover:bg-red-600" : "bg-brand-700 hover:bg-brand-800"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : announcement.isActive ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      {announcement.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(announcement)} disabled={isSubmitting} className="h-10 w-10 bg-white border-brand-100 text-brand-700 hover:bg-brand-50 rounded-xl shadow-sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={deletingId === announcement.id || isSubmitting}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl"
                        >
                          {deletingId === announcement.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold text-brand-800">Delete announcement?</AlertDialogTitle>
                          <AlertDialogDescription className="text-base">
                            This will permanently delete the announcement
                            <span className="font-semibold text-brand-700"> "{announcement.title}"</span>. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="rounded-xl border-brand-100">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(announcement.id, announcement.title)} 
                            className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
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

      {/* Dialog for Add/Edit Announcement */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-brand-700">
              {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Important Notice: Hostel Closure" {...field} className="focus-visible:ring-brand-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-brand-gold">
                          <SelectValue placeholder="Select announcement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="info">Information (Blue)</SelectItem>
                        <SelectItem value="urgent">Urgent (Red)</SelectItem>
                        <SelectItem value="celebration">Celebration (Gold)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="messageMd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Markdown)</FormLabel>
                    <FormControl>
                      <MarkdownEditor 
                        placeholder="Write the detailed message here..." 
                        rows={8} 
                        value={field.value} 
                        onChange={field.onChange} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Activate Announcement
                      </FormLabel>
                      <FormDescription>
                        If checked, this announcement will immediately appear on the public homepage. (Only one announcement can be active at a time.)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Announcement"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalAnnouncementManagement;