"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentUploadProps {
  label: string;
  value?: string; // URL of the uploaded document
  fileType?: string; // Type of the uploaded document (e.g., 'PDF', 'DOCX')
  fileSize?: string; // Size of the uploaded document (e.g., '1.2 MB')
  onChange: (url: string | undefined, fileType: string | undefined, fileSize: string | undefined) => void;
  bucketName: string;
  folderPath: string;
  disabled?: boolean;
  className?: string;
}

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper to get file extension and type
const getFileTypeAndExtension = (fileName: string): { extension: string; type: string } => {
  const parts = fileName.split('.');
  const extension = parts.pop()?.toLowerCase() || '';
  let type = extension.toUpperCase(); // Default to extension

  // Common document types
  if (['pdf'].includes(extension)) type = 'PDF';
  else if (['doc', 'docx'].includes(extension)) type = 'DOCX';
  else if (['xls', 'xlsx'].includes(extension)) type = 'XLSX';
  else if (['ppt', 'pptx'].includes(extension)) type = 'PPTX';
  else if (['txt'].includes(extension)) type = 'TXT';
  else if (['zip', 'rar'].includes(extension)) type = 'Archive';
  else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) type = 'Image';

  return { extension, type };
};

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  value,
  fileType,
  fileSize,
  onChange,
  bucketName,
  folderPath,
  disabled,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | undefined>(value);
  const [currentFileType, setCurrentFileType] = useState<string | undefined>(fileType);
  const [currentFileSize, setCurrentFileSize] = useState<string | undefined>(fileSize);

  React.useEffect(() => {
    setCurrentFileUrl(value);
    setCurrentFileType(fileType);
    setCurrentFileSize(fileSize);
  }, [value, fileType, fileSize]);

  const uploadFileToStorage = async (file: File): Promise<{ url: string | null; type: string | null; size: string | null }> => {
    const { extension, type } = getFileTypeAndExtension(file.name);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
    const filePath = `${folderPath}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      toast.error(`File upload failed: ${uploadError.message}`);
      return { url: null, type: null, size: null };
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return { url: data.publicUrl, type, size: formatFileSize(file.size) };
  };

  const deleteFileFromStorage = async (url: string): Promise<boolean> => {
    if (!url) return true;

    const pathSegments = url.split('/');
    const fileNameWithFolder = pathSegments.slice(pathSegments.indexOf(bucketName) + 1).join('/');

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileNameWithFolder]);

    if (deleteError) {
      console.error("Error deleting file:", deleteError);
      toast.error(`File deletion failed: ${deleteError.message}`);
      return false;
    }
    return true;
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // If there's an existing file, delete it first
      if (currentFileUrl) {
        await deleteFileFromStorage(currentFileUrl);
      }

      const { url: uploadedUrl, type: uploadedType, size: uploadedSize } = await uploadFileToStorage(file);
      if (uploadedUrl) {
        setCurrentFileUrl(uploadedUrl);
        setCurrentFileType(uploadedType || undefined);
        setCurrentFileSize(uploadedSize || undefined);
        onChange(uploadedUrl, uploadedType || undefined, uploadedSize || undefined);
        toast.success("Document uploaded successfully!");
      } else {
        onChange(undefined, undefined, undefined);
      }
    } catch (error) {
      console.error("Error during document upload process:", error);
      toast.error("Failed to upload document.");
      onChange(undefined, undefined, undefined);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, currentFileUrl, bucketName, folderPath]);

  const handleRemoveFile = useCallback(async () => {
    if (!currentFileUrl) return;

    setIsUploading(true); // Use uploading state for deletion too
    try {
      const success = await deleteFileFromStorage(currentFileUrl);
      if (success) {
        setCurrentFileUrl(undefined);
        setCurrentFileType(undefined);
        setCurrentFileSize(undefined);
        onChange(undefined, undefined, undefined);
        toast.success("Document removed successfully!");
      }
    } catch (error) {
      console.error("Error during document deletion process:", error);
      toast.error("Failed to remove document.");
    } finally {
      setIsUploading(false);
    }
  }, [currentFileUrl, onChange, bucketName, folderPath]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="document-upload">{label}</Label>
      <div className="flex items-center space-x-4">
        {currentFileUrl && (
          <div className="relative flex items-center justify-center h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
            <FileText className="h-12 w-12 text-brand-500" />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove document</span>
              </Button>
            )}
          </div>
        )}
        <div className="flex-1">
          <Input
            id="document-upload"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" // Restrict to common document types
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Label
            htmlFor="document-upload"
            className={cn(
              "flex items-center justify-center px-4 py-2 border border-input rounded-md cursor-pointer text-sm font-medium",
              "bg-background hover:bg-accent hover:text-accent-foreground",
              (disabled || isUploading) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {currentFileUrl ? "Change Document" : "Upload Document"}
              </>
            )}
          </Label>
        </div>
      </div>
      {currentFileUrl && (
        <p className="text-xs text-muted-foreground break-all">
          Current File: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="underline">{currentFileUrl}</a>
          {currentFileType && currentFileSize && (
            <span className="ml-2">({currentFileType}, {currentFileSize})</span>
          )}
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;