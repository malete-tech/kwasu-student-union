"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileText, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import DocumentUpload from "@/components/DocumentUpload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  url: z.string().url({ message: "Document URL is required." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
});

const EditDocument: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", tags: "", url: "", fileType: "", fileSize: "" },
  });

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        const fetchedDocument = await api.documents.getById(id);
        if (fetchedDocument) {
          form.reset({
            title: fetchedDocument.title,
            tags: fetchedDocument.tags.join(', '),
            url: fetchedDocument.url,
            fileType: fetchedDocument.fileType,
            fileSize: fetchedDocument.fileSize,
          });
        }
      } catch (err) {
        toast.error("Failed to load document.");
      } finally {
        setLoadingDocument(false);
      }
    };
    fetchDocument();
  }, [id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updatedDocument = {
        title: values.title,
        url: values.url,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        fileType: values.fileType,
        fileSize: values.fileSize,
      };
      await api.documents.update(id, updatedDocument);
      toast.success("Document updated successfully!");
      navigate("/admin/documents");
    } catch (error) {
      toast.error("Failed to update document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDocument) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Document | KWASU SU Admin</title>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-700">Edit Vault Resource</h2>
            <p className="text-muted-foreground mt-1">Update the file or details for this student resource.</p>
          </div>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vault
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Upload className="h-4 w-4" />
                  File Source
                </div>
                <p className="text-sm text-muted-foreground">Change the file associated with this entry.</p>
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Replace File</FormLabel>
                      <FormControl>
                        <DocumentUpload
                          label="Choose Document"
                          bucketName="documents"
                          folderPath="public"
                          value={field.value}
                          fileType={form.getValues("fileType")}
                          fileSize={form.getValues("fileSize")}
                          onChange={(url, fileType, fileSize) => {
                            field.onChange(url);
                            form.setValue("fileType", fileType || "", { shouldValidate: true });
                            form.setValue("fileSize", fileSize || "", { shouldValidate: true });
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Input type="hidden" {...form.register("fileType")} />
                <Input type="hidden" {...form.register("fileSize")} />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <FileText className="h-4 w-4" />
                  Metadata
                </div>
                <p className="text-sm text-muted-foreground">Identify and categorize this resource.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Document Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2024 Welfare Guide" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Filter Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. guide, welfare, policy" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex pt-6">
              <Button type="submit" className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Updating...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditDocument;