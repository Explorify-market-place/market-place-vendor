"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BulkImageUploadProps {
  planId: string;
  onComplete: (imageKeys: string[]) => void;
  onClose: () => void;
  maxImages?: number;
}

interface ImageFile {
  file: File;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  s3Key?: string;
  previewUrl: string;
}

const MAX_IMAGES_DEFAULT = 20;

export function BulkImageUpload({
  planId,
  onComplete,
  onClose,
  maxImages = MAX_IMAGES_DEFAULT,
}: BulkImageUploadProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFilesOnly = files.filter((f) => f.type.startsWith("image/"));

    if (imageFilesOnly.length === 0) {
      toast.error("Please select image files only");
      return;
    }

    if (imageFiles.length + imageFilesOnly.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImageFiles: ImageFile[] = imageFilesOnly.map((file) => ({
      file,
      status: "pending",
      previewUrl: URL.createObjectURL(file),
    }));

    setImageFiles([...imageFiles, ...newImageFiles]);
  };

  const removeFile = async (index: number) => {
    const file = imageFiles[index];
    
    // If file was already uploaded, delete from S3
    if (file.s3Key) {
      try {
        await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: file.s3Key }),
        });
      } catch (error) {
        console.error("Error deleting file from S3:", error);
      }
    }
    
    // Revoke preview URL to free memory
    URL.revokeObjectURL(file.previewUrl);
    
    // Remove from state
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const uploadAllImages = async () => {
    setUploading(true);
    setCompletedCount(0);

    // Process all images in parallel
    const promises = imageFiles.map(async (imageFile, index) => {
      try {
        // Update status to uploading
        setImageFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "uploading";
          return updated;
        });

        // Get presigned URL
        const presignedResponse = await fetch("/api/upload/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uploadType: "tripImage",
            fileName: imageFile.file.name,
            contentType: imageFile.file.type,
            planId,
            index: index + 1, // 1-based indexing
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, key } = await presignedResponse.json();

        // Upload to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: imageFile.file,
          headers: {
            "Content-Type": imageFile.file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        // Update status to completed
        setImageFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "completed";
          updated[index].s3Key = key;
          return updated;
        });

        setCompletedCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "failed";
          updated[index].error =
            error instanceof Error ? error.message : "Unknown error";
          return updated;
        });
      }
    });

    // Wait for all to complete
    await Promise.all(promises);
    setUploading(false);

    // Get successfully uploaded keys
    const successfulKeys = imageFiles
      .filter((img) => img.status === "completed" && img.s3Key)
      .map((img) => img.s3Key!);

    const failedCount = imageFiles.filter(
      (img) => img.status === "failed",
    ).length;

    if (failedCount > 0) {
      toast.warning(
        `${successfulKeys.length}/${imageFiles.length} images uploaded successfully`,
        { description: `${failedCount} failed. You can retry or continue.` }
      );
    } else {
      toast.success(`All ${successfulKeys.length} images uploaded successfully!`);
    }

    if (successfulKeys.length > 0) {
      onComplete(successfulKeys);
    }
  };

  const getStatusIcon = (status: ImageFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-bold">
              Bulk Image Upload
            </CardTitle>
            <CardDescription>
              Upload up to {maxImages} trip images at once
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || imageFiles.length >= maxImages}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Click to select images
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {imageFiles.length}/{maxImages} images selected
              </p>
            </button>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300">
                  Uploading...
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {completedCount}/{imageFiles.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedCount / imageFiles.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Image Grid */}
          {imageFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Selected Images ({imageFiles.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map((imageFile, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-800 group"
                  >
                    <Image
                      src={imageFile.previewUrl}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Status Overlay */}
                    {imageFile.status !== "pending" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {getStatusIcon(imageFile.status)}
                      </div>
                    )}

                    {/* Remove Button */}
                    {!uploading && (imageFile.status === "pending" || imageFile.status === "failed") && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Error Message */}
                    {imageFile.status === "failed" && (
                      <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-xs p-1 text-center">
                        {imageFile.error || "Failed"}
                      </div>
                    )}

                    {/* Index Badge */}
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={uploadAllImages}
              disabled={imageFiles.length === 0 || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${imageFiles.length} Image${imageFiles.length !== 1 ? "s" : ""}`
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>

          {/* Info Message */}
          {imageFiles.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              ℹ️ The first image will be used as the main trip image
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
