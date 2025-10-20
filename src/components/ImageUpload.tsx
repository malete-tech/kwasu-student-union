"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, UploadCloud, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/integrations/supabase/storage";
import { toast } from "sonner";

interface ImageUploadProps {
  label: string;
  value?: string; // Current image URL
  onChange: (url: string | undefined) => void; // Callback for when URL changes
  bucketName: string;
  folderPath: string; // e.g., "news-covers"
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  bucketName,
  folderPath,
  className,
  disabled,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filePath = `${folderPath}/${Date.now()}-${file.name}`;
      const publicUrl = await uploadImage(file, bucketName, filePath);
      if (publicUrl) {
        onChange(publicUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to get public URL for the uploaded image.");
        onChange(undefined);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
      onChange(undefined);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the input
      }
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    toast.info("Image removed.");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex items-center space-x-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
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
        ) : (
          <div className="w-24 h-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 flex-shrink-0">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        <div className="flex-grow">
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isUploading || disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
            className="w-full focus-visible:ring-brand-gold"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                {value ? "Change Image" : "Upload Image"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;