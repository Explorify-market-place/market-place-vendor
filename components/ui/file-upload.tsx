"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface FileUploadProps {
  endpoint: "profileImage" | "tripImage" | "tripItinerary";
  value: string;
  onChange: (url?: string) => void;
  onRemove: (url: string) => void;
}

export const FileUpload = ({
  endpoint,
  value,
  onChange,
  onRemove,
}: FileUploadProps) => {
  const fileType = endpoint === "tripItinerary" ? "pdf" : "image";

  if (value && fileType === "image") {
    return (
      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Image fill src={value} alt="Upload" className="object-cover" />
        <Button
          onClick={() => onRemove(value)}
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

  if (value && fileType === "pdf") {
    return (
      <div className="flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <FileText className="h-10 w-10 text-blue-500 mr-4" />
        <div className="flex-1 overflow-hidden">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block"
          >
            {value.split("/").pop()}
          </a>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PDF Document
          </p>
        </div>
        <Button
          onClick={() => onRemove(value)}
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

  return (
    <div className="w-full">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res: { url: string }[]) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
        appearance={{
          container:
            "border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors",
          label: "text-slate-600 dark:text-slate-400 hover:text-blue-600",
          button:
            "bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors date:bg-blue-700",
          allowedContent: "text-slate-400 text-xs",
        }}
        content={{
          label: ({ ready }: { ready: boolean }) =>
            ready ? (
              <div className="flex flex-col items-center gap-2">
                {fileType === "image" ? (
                  <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                ) : (
                  <FileText className="h-8 w-8 text-slate-400 mb-2" />
                )}
                <span className="font-semibold text-sm">
                  Click to upload or drag and drop
                </span>
              </div>
            ) : (
              "Loading..."
            ),
        }}
      />
    </div>
  );
};
