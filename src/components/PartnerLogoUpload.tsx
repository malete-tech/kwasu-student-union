"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, XCircle, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";
import { uploadImageToCloudinary, deleteImageFromCloudinary, getCloudinaryPublicId } from "@/utils/cloudinary-upload";

interface PartnerLogoUploadProps {
  label: string;
  value?: string; // URL of the uploaded image
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

const CLOUDINARY_FOLDER = "partner-logos";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

const PartnerLogoUpload: React.FC<PartnerLogoUploadProps> = ({
  label,
  value,
  onChange,
  disabled,
  className,
}) => {
  const { session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  React.useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.access_token) {
      if (!session?.access_token && file) toast.error("Authentication required for upload.");
      return;
    }

    // Check file size (2MB limit)
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size allowed is 2MB.");
      event.target.value = ""; // Clear input
      return;
    }

    setIsUploading(true);
    try {
      // 1. If there's an existing image, delete it from Cloudinary first
      if (previewUrl) {
        const publicId = getCloudinaryPublicId(previewUrl);
        if (publicId) {
          await deleteImageFromCloudinary(publicId, session.access_token);
        }
      }

      // 2. Upload the new image
      const uploadResult = await uploadImageToCloudinary(file, CLOUDINARY_FOLDER, session.access_token);
      
      if (uploadResult) {
        setPreviewUrl(uploadResult.publicUrl);
        onChange(uploadResult.publicUrl);
        toast.success("Logo uploaded successfully!");
      } else {
        onChange(undefined);
      }
    } catch (error) {
      console.error("Error during logo upload process:", error);
      toast.error("Failed to upload logo.");
      onChange(undefined);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, previewUrl, session]);

  const handleRemoveImage = useCallback(async () => {
    if (!previewUrl || !session?.access_token) return;

    setIsUploading(true);
    try {
      const publicId = getCloudinaryPublicId(previewUrl);
      if (!publicId) {
        // If we can't find a public ID, just clear it locally
        setPreviewUrl(undefined);
        onChange(undefined);
        return;
      }

      const success = await deleteImageFromCloudinary(publicId, session.access_token);
      if (success) {
        setPreviewUrl(undefined);
        onChange(undefined);
        toast.success("Logo removed successfully!");
      }
    } catch (error) {
      console.error("Error during logo deletion process:", error);
      toast.error("Failed to remove logo from server.");
    } finally {
      setIsUploading(false);
    }
  }, [previewUrl, onChange, session]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="partner-logo-upload" className="text-slate-700 font-semibold">{label}</Label>
      <div className="flex items-center space-x-4">
        {previewUrl ? (
          <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden border border-brand-100 bg-white p-2 shadow-sm">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove logo</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-brand-100 flex items-center justify-center bg-brand-50/30">
            <Image className="h-8 w-8 text-brand-200" />
          </div>
        )}
        <div className="flex-1">
          <Input
            id="partner-logo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Label
            htmlFor="partner-logo-upload"
            className={cn(
              "flex items-center justify-center px-4 py-2.5 border border-brand-100 rounded-xl cursor-pointer text-sm font-bold transition-all",
              "bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-200 shadow-sm",
              (disabled || isUploading) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {previewUrl ? "Change Logo" : "Upload Logo"}
              </>
            )}
          </Label>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">Max size: 2MB • PNG/JPG preferred</p>
        </div>
      </div>
      {previewUrl && (
        <p className="text-[10px] text-muted-foreground break-all mt-1 opacity-50">
          Source: <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-500">{previewUrl}</a>
        </p>
      )}
    </div>
  );
};

export default PartnerLogoUpload;