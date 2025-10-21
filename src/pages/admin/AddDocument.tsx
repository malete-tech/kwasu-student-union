"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-700">Add New Document</h2>
          <Button asChild variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-brand-gold">
            <Link to="/admin/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents Management
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg rounded-xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-brand-700">New Document Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="KWASU SU Constitution" {...field} className="focus-visible:ring-brand-gold" />
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
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="policy, constitution, academic" {...field} className="focus-visible:ring-brand-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document File</FormLabel>
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
                            form.setValue("fileType", fileType || "");
                            form.setValue("fileSize", fileSize || "");
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Hidden fields for fileType and fileSize, managed by DocumentUpload */}
                <Input type="hidden" {...form.register("fileType")} />
                <Input type="hidden" {...form.register("fileSize")} />

                <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold" disabled={isSubmitting || !form.formState.isValid}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Document...
                    </>
                  ) : (
                    "Add Document"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddDocument;