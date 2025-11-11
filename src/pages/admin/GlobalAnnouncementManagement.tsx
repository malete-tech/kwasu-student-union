"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Megaphone, Edit, Trash2, PlusCircle, CheckCircle, XCircle } from "lucide-react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";

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

  const getCardClasses = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-destructive bg-red-50';
      case 'celebration':
        return 'border-l-4 border-brand-gold bg-yellow-50';
      case 'info':
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  return (
    <>
      <Helmet>
        <title>Global Announcements | KWASU SU Admin</title>
        <meta name="description" content="Manage site-wide popups and banners for urgent or celebratory messages." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Global Announcements</h2>
          <Button onClick={() => handleOpenDialog()} className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">Manage Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-destructive text-center text-lg">{error}</div>
            ) : announcements.length === 0 ? (
              <p className="text-center text-muted-foreground">No announcements found. Create one now!</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg shadow-sm ${getCardClasses(announcement.type)}`}>
                    <div className="flex items-start space-x-4 flex-1 min-w-0 mb-2 sm:mb-0">
                      <div className="p-2 rounded-full bg-white text-brand-700 flex-shrink-0">
                        <Megaphone className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-brand-800 truncate">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">Type: {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}</p>
                        <div className="mt-1">
                          {announcement.isActive ? (
                            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                      <Button 
                        variant={announcement.isActive ? "destructive" : "default"} 
                        size="sm" 
                        onClick={() => handleToggleActive(announcement)}
                        disabled={isSubmitting}
                        className={announcement.isActive ? "bg-red-500 hover:bg-red-600" : "bg-brand-700 hover:bg-brand-800"}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : announcement.isActive ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                        {announcement.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(announcement)} disabled={isSubmitting}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" disabled={deletingId === announcement.id || isSubmitting}>
                            {deletingId === announcement.id ? (
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
                              This action cannot be undone. This will permanently delete the announcement
                              "{announcement.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(announcement.id, announcement.title)} className="bg-destructive hover:bg-destructive/90">
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

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Urgent: Semester Break Announced" {...field} className="focus-visible:ring-brand-gold" />
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
                        <SelectItem value="info">Info (Blue)</SelectItem>
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
                      <p className="text-sm text-muted-foreground">
                        If checked, this message will immediately appear on the public site. Only one announcement should be active at a time.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>Cancel</Button>
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