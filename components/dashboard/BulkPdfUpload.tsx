"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BulkPdfUploadProps {
  onClose: () => void;
}

interface PdfFile {
  file: File;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
  s3Key?: string; // Temp S3 key before processing
  planId?: string;
  planName?: string;
}

const MAX_FILES = 30;

export function BulkPdfUpload({ onClose }: BulkPdfUploadProps) {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFilesOnly = files.filter((f) => f.type === "application/pdf");

    if (pdfFilesOnly.length === 0) {
      toast.error("Please select PDF files only");
      return;
    }

    if (pdfFiles.length + pdfFilesOnly.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} PDFs allowed`);
      return;
    }

    const newPdfFiles: PdfFile[] = pdfFilesOnly.map((file) => ({
      file,
      status: "pending",
    }));

    setPdfFiles([...pdfFiles, ...newPdfFiles]);
  };

  const removeFile = async (index: number) => {
    const file = pdfFiles[index];
    
    // If file was uploaded but not yet processed, delete from S3
    if (file.s3Key && (file.status === "uploading" || file.status === "failed")) {
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
    
    // Remove from state
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
  };

  const processAllPdfs = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to upload PDFs");
      return;
    }

    setProcessing(true);
    setCompletedCount(0);

    // Process all PDFs in parallel
    const promises = pdfFiles.map(async (pdfFile, index) => {
      try {
        // Update status to uploading
        setPdfFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "uploading";
          return updated;
        });

        // Step 1: Get presigned URL
        const presignedResponse = await fetch("/api/upload/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uploadType: "tripItinerary",
            fileName: pdfFile.file.name,
            contentType: "application/pdf",
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, key } = await presignedResponse.json();

        // Store the S3 key
        setPdfFiles((prev) => {
          const updated = [...prev];
          updated[index].s3Key = key;
          return updated;
        });

        // Step 2: Upload to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: pdfFile.file,
          headers: {
            "Content-Type": "application/pdf",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload PDF");
        }

        // Update status to processing
        setPdfFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "processing";
          return updated;
        });

        // Step 3: Process PDF with Lambda
        const processResponse = await fetch("/api/plans/process-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfKey: key }),
        });

        if (!processResponse.ok) {
          const errorData = await processResponse.json();
          throw new Error(errorData.details || "PDF processing failed");
        }

        const { planId, name } = await processResponse.json();

        // Update status to completed
        setPdfFiles((prev) => {
          const updated = [...prev];
          updated[index].status = "completed";
          updated[index].planId = planId;
          updated[index].planName = name;
          return updated;
        });

        setCompletedCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error processing PDF:", error);
        setPdfFiles((prev) => {
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
    setProcessing(false);

    // Show results and refresh dashboard
    const successCount = pdfFiles.filter(
      (p) => p.status === "completed",
    ).length;
    const failedCount = pdfFiles.filter((p) => p.status === "failed").length;

    if (failedCount > 0) {
      const failedFiles = pdfFiles
        .filter((p) => p.status === "failed")
        .map((p) => p.file.name)
        .join(", ");
      toast.warning(
        `${successCount}/${pdfFiles.length} plans created successfully`,
        { description: `Failed: ${failedFiles}. Retry or create manually.` }
      );
    } else {
      toast.success(`All ${successCount} plans created successfully!`);
    }

    // Redirect to dashboard
    router.refresh();
    onClose();
  };

  const getStatusIcon = (status: PdfFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (pdfFile: PdfFile) => {
    switch (pdfFile.status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "completed":
        return pdfFile.planName || "Completed";
      case "failed":
        return `Failed: ${pdfFile.error || "Unknown error"}`;
      default:
        return "Ready";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-bold">Bulk PDF Upload</CardTitle>
            <CardDescription>
              Upload up to {MAX_FILES} trip itinerary PDFs at once
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={processing}
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
              accept="application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={processing}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={processing || pdfFiles.length >= MAX_FILES}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Click to select PDFs
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {pdfFiles.length}/{MAX_FILES} files selected
              </p>
            </button>
          </div>

          {/* Progress Bar */}
          {processing && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300">
                  Processing...
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {completedCount}/{pdfFiles.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedCount / pdfFiles.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* File List */}
          {pdfFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Files ({pdfFiles.length})
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {pdfFiles.map((pdfFile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    {getStatusIcon(pdfFile.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-slate-700 dark:text-slate-300">
                        {pdfFile.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getStatusText(pdfFile)}
                      </p>
                    </div>
                    {!processing && pdfFile.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={processAllPdfs}
              disabled={pdfFiles.length === 0 || processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process ${pdfFiles.length} PDF${pdfFiles.length !== 1 ? "s" : ""}`
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={processing}
            >
              {processing ? "Processing..." : "Cancel"}
            </Button>
          </div>

          {/* Warning Message */}
          {pdfFiles.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              ⚠️ Review plans and sensitive details before scheduling departures
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
