"use client";

import { X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { toast } from "sonner";
import { getPublicUrl } from "@/lib/s3";
import { useState, useRef } from "react";

interface FileUploadProps {
  endpoint: "profileImage" | "tripImage" | "tripItinerary";
  value: string; // S3 key
  onChange: (key?: string) => void;
  onRemove: (key: string) => void;
  planId?: string; // Required for tripImage
  index?: number; // Required for tripImage
}

const FILE_CONFIG = {
  image: {
    accept: "image/*",
    maxSize: "10MB",
    icon: ImageIcon,
    validate: (type: string) => type.startsWith("image/"),
    errorMsg: "Please upload an image file",
  },
  pdf: {
    accept: "application/pdf",
    maxSize: "10MB",
    icon: FileText,
    validate: (type: string) => type === "application/pdf",
    errorMsg: "Please upload a PDF file",
  },
} as const;

export const FileUpload = ({
  endpoint,
  value,
  onChange,
  onRemove,
  planId,
  index,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileType = endpoint === "tripItinerary" ? "pdf" : "image";
  const config = FILE_CONFIG[fileType];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!config.validate(file.type)) {
      toast.error(config.errorMsg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      // Get presigned URL and upload to S3
      const { uploadUrl, key } = await getPresignedUrl(file, endpoint, planId, index);
      await uploadToS3(uploadUrl, file);
      onChange(key);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (key: string) => {
    try {
      // Delete from S3
      await deleteFromS3(key);
      // Notify parent component
      onRemove(key);
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file. Please try again.");
    }
  };

  // Render uploaded image
  if (value && fileType === "image") {
    return (
      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Image fill src={getPublicUrl(value)} alt="Upload" className="object-cover" />
        <Button
          onClick={() => handleRemove(value)}
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Render uploaded PDF
  if (value && fileType === "pdf") {
    const fileName = value.split("/").pop() || "document.pdf";
    return (
      <div className="flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <FileText className="h-10 w-10 text-blue-500 mr-4" />
        <div className="flex-1 overflow-hidden">
          <a
            href={getPublicUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block"
          >
            {fileName}
          </a>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PDF Document
          </p>
        </div>
        <Button
          onClick={() => handleRemove(value)}
          variant="ghost"
          size="icon"
          className="ml-auto text-slate-500 hover:text-red-500"
          type="button"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  const Icon = config.icon;

  // Render upload button
  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={config.accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors p-8 flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Uploading...
            </span>
          </>
        ) : (
          <>
            <Icon className="h-8 w-8 text-slate-400 mb-2" />
            <span className="font-semibold text-sm text-slate-600 dark:text-slate-400">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-slate-400">
              {fileType === "image" ? `PNG, JPG, GIF up to ${config.maxSize}` : `PDF up to ${config.maxSize}`}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

// Helper function to get presigned URL
async function getPresignedUrl(
  file: File,
  endpoint: string,
  planId?: string,
  index?: number,
): Promise<{ uploadUrl: string; key: string }> {
  const response = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uploadType: endpoint,
      fileName: file.name,
      contentType: file.type,
      planId,
      index,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  return response.json();
}

// Helper function to upload to S3
async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
}

// Helper function to delete from S3
async function deleteFromS3(key: string): Promise<void> {
  const response = await fetch("/api/upload/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
}
