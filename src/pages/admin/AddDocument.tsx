"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileText, Tag, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import DocumentUpload from "@/components/DocumentUpload";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  url: z.string().url({ message: "Document URL is required and must be a valid URL." }),
  fileType: z.string().min(1, { message: "File type is required." }),
  fileSize: z.string().min(1, { message: "File size is required." }),
});

const AddDocument: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tags: "",
      url: "",
      fileType: "",
      fileSize: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newDocument = {
        title: values.title,
        url: values.url,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        fileType: values.fileType,
        fileSize: values.fileSize,
      };
      await api.documents.create(newDocument);
      toast.success("Document added successfully!");
      form.reset();
      navigate("/admin/documents");
    } catch (error) {
      console.error("Failed to add document:", error);
      toast.error("Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Document | KWASU SU Admin</title>
        <meta name="description" content="Add a new downloadable document to the KWASU Students' Union website." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Upload New Document</h2>
          <Button asChild variant="ghost" className="text-brand-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Link to="/admin/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents Management
            </Link>
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 rounded-2xl shadow-lg">
            {/* 1. Document Upload Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <Upload className="h-4 w-4" />
                  File Upload
                </div>
                <p className="text-sm text-muted-foreground">Select the document file to upload to the storage bucket.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Document File</FormLabel>
                      <FormControl>
                        <DocumentUpload
                          label="Upload Document"
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
                      <FormDescription>
                        Supported formats: PDF, DOCX, XLSX, PPTX, TXT.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Hidden fields for fileType and fileSize, managed by DocumentUpload */}
                <Input type="hidden" {...form.register("fileType")} />
                <Input type="hidden" {...form.register("fileSize")} />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Metadata Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-xs">
                  <FileText className="h-4 w-4" />
                  Document Metadata
                </div>
                <p className="text-sm text-muted-foreground">Provide a clear title and relevant tags for easy searching.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="KWASU SU Constitution" {...field} className="h-12 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
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
                      <FormLabel className="text-slate-700 font-semibold">Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="policy, constitution, academic" {...field} className="h-10 rounded-xl border-brand-100 bg-white/50 focus-visible:ring-brand-gold shadow-sm" />
                      </FormControl>
                      <FormDescription>
                        Tags help students filter and find documents quickly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex pt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto px-10 h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg font-bold" 
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Adding Document...
                  </>
                ) : (
                  "Add Document"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddDocument;