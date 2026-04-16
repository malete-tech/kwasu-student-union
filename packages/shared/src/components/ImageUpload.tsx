"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/integrations/supabase/storage";
import { toast } from "sonner";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  bucketName: string;
  folderPath: string;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  bucketName,
  folderPath,
  disabled,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  React.useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // If there's an existing image, delete it first
      if (previewUrl) {
        await deleteImage(previewUrl, bucketName, folderPath);
      }

      const uploadedUrl = await uploadImage(file, bucketName, folderPath);
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        onChange(uploadedUrl);
        toast.success("Image uploaded successfully!");
      } else {
        onChange(undefined);
      }
    } catch (error) {
      console.error("Error during image upload process:", error);
      toast.error("Failed to upload image.");
      onChange(undefined);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, previewUrl, bucketName, folderPath]);

  const handleRemoveImage = useCallback(async () => {
    if (!previewUrl) return;

    setIsUploading(true); // Use uploading state for deletion too
    try {
      const success = await deleteImage(previewUrl, bucketName, folderPath);
      if (success) {
        setPreviewUrl(undefined);
        onChange(undefined);
        toast.success("Image removed successfully!");
      }
    } catch (error) {
      console.error("Error during image deletion process:", error);
      toast.error("Failed to remove image.");
    } finally {
      setIsUploading(false);
    }
  }, [previewUrl, onChange, bucketName, folderPath]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="image-upload">{label}</Label>
      <div className="flex items-center space-x-4">
        {previewUrl && (
          <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
          </div>
        )}
        <div className="flex-1">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Label
            htmlFor="image-upload"
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
                {previewUrl ? "Change Image" : "Upload Image"}
              </>
            )}
          </Label>
        </div>
      </div>
      {previewUrl && (
        <p className="text-xs text-muted-foreground break-all">
          Current URL: <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline">{previewUrl}</a>
        </p>
      )}
    </div>
  );
};

export default ImageUpload;