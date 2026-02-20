"use client";

import { useState } from "react";
import {
  X,
  Link,
  Loader2,
  Globe,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
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
import { processLinkExtraction } from "@/app/actions/plan-extraction";

interface BulkLinkUploadProps {
  onClose: () => void;
}

interface LinkItem {
  url: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
  planId?: string;
  planName?: string;
}

const MAX_LINKS = 20;

export function BulkLinkUpload({ onClose }: BulkLinkUploadProps) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const addLink = () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;

    if (!isValidUrl(trimmed)) {
      toast.error(
        "Please enter a valid URL (starting with http:// or https://)",
      );
      return;
    }

    if (links.length >= MAX_LINKS) {
      toast.error(`Maximum ${MAX_LINKS} links allowed`);
      return;
    }

    if (links.some((l) => l.url === trimmed)) {
      toast.error("This link has already been added");
      return;
    }

    setLinks([...links, { url: trimmed, status: "pending" }]);
    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    // Check if pasted text contains multiple URLs (one per line)
    const urls = pastedText
      .split(/[\n\r]+/)
      .map((u) => u.trim())
      .filter((u) => u && isValidUrl(u));

    if (urls.length > 1) {
      e.preventDefault();
      const existingUrls = new Set(links.map((l) => l.url));
      const newLinks = urls
        .filter((u) => !existingUrls.has(u))
        .slice(0, MAX_LINKS - links.length)
        .map((url): LinkItem => ({ url, status: "pending" }));

      if (newLinks.length > 0) {
        setLinks([...links, ...newLinks]);
        toast.success(
          `Added ${newLinks.length} link${newLinks.length !== 1 ? "s" : ""}`,
        );
      }
      setCurrentInput("");
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const processAllLinks = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to process links");
      return;
    }

    setProcessing(true);
    setCompletedCount(0);

    // Process all links in parallel
    const promises = links.map(async (linkItem, index) => {
      try {
        // Update status to processing
        setLinks((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: "processing" };
          return updated;
        });

        // Call server action directly
        const result = await processLinkExtraction(linkItem.url);

        if (!result.success) {
          throw new Error(result.error);
        }

        const { planId, name } = result;

        // Update status to completed
        setLinks((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: "completed",
            planId,
            planName: name,
          };
          return updated;
        });

        setCompletedCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error processing link:", error);
        setLinks((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          };
          return updated;
        });
      }
    });

    await Promise.all(promises);
    setProcessing(false);

    // Show results
    const finalLinks = links;
    const successCount = finalLinks.filter(
      (l) => l.status === "completed",
    ).length;
    const failedCount = finalLinks.filter((l) => l.status === "failed").length;

    if (failedCount > 0) {
      toast.warning(
        `${successCount}/${finalLinks.length} plans created successfully`,
        {
          description: `${failedCount} link${failedCount !== 1 ? "s" : ""} failed. Retry or create manually.`,
        },
      );
    } else if (successCount > 0) {
      toast.success(`All ${successCount} plans created successfully!`);
    }

    router.refresh();
    onClose();
  };

  const getStatusIcon = (status: LinkItem["status"]) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Globe className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (linkItem: LinkItem) => {
    switch (linkItem.status) {
      case "processing":
        return "Processing...";
      case "completed":
        return linkItem.planName || "Completed";
      case "failed":
        return `Failed: ${linkItem.error || "Unknown error"}`;
      default:
        return "Ready";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-bold">
              Import from Links
            </CardTitle>
            <CardDescription>
              Paste trip listing URLs to auto-create plans (up to {MAX_LINKS}{" "}
              links)
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
          {/* Link Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={currentInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Paste a trip listing URL and press Enter..."
              disabled={processing || links.length >= MAX_LINKS}
              className="flex-1 h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              type="button"
              onClick={addLink}
              disabled={
                processing || !currentInput.trim() || links.length >= MAX_LINKS
              }
              size="sm"
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paste multiple URLs (one per line) to add them all at once
          </p>

          {/* Progress Bar */}
          {processing && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300">
                  Processing links...
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {completedCount}/{links.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedCount / links.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Link List */}
          {links.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Links ({links.length})
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {links.map((linkItem, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    {getStatusIcon(linkItem.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-slate-700 dark:text-slate-300">
                        {linkItem.url}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getStatusText(linkItem)}
                      </p>
                    </div>
                    {!processing && linkItem.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
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
              onClick={processAllLinks}
              disabled={links.length === 0 || processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  {`Process ${links.length} Link${links.length !== 1 ? "s" : ""}`}
                </>
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
          {links.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              ⚠️ Review plans and sensitive details before scheduling departures
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
