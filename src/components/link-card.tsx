"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Copy, MousePointer, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
// using external anchor to hit redirect route
import useLinkClicks from "@/hooks/use-link-clicks";
import Link from "next/link";
import { deleteLink as deleteLinkApi } from "@/lib/supabase/frontend";
import { useLinks } from "@/hooks/use-links";
import { useToast } from "@/hooks/use-toast";

interface LinkCardProps {
  id: string;
  favicon: string;
  shortUrl: string;
  fullUrl: string;
  description: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
  slug?: string;
}

function LinkCardInner({
  id,
  favicon,
  shortUrl,
  fullUrl,
  clicks,
  createdAt,
  isActive,
  slug,
}: LinkCardProps) {
  const { clicks: realtimeClicks, isLoading } = useLinkClicks(id);
  const { deleteLink } = useLinks();
  const { toast } = useToast();

  const displayClicks = useMemo(
    () => (isLoading ? clicks : realtimeClicks),
    [isLoading, clicks, realtimeClicks]
  );

  // Determine destination for redirect: prefer slug if present, else extract path from shortUrl, fall back to fullUrl
  const destination = useMemo(() => {
    if (slug) return `/${slug}`;
    try {
      const url = new URL(
        shortUrl.startsWith("http") ? shortUrl : `https://${shortUrl}`
      );
      const p = url.pathname.replace(/^\//, "");
      return p ? `/${p}` : fullUrl;
    } catch {
      // if parsing fails, fallback
      return fullUrl;
    }
  }, [slug, shortUrl, fullUrl]);

  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="flex items-center gap-4 border border-border p-4 transition-colors hover:border-muted-foreground">
        {/* Favicon */}
        <div className="flex-shrink-0">
          <img
            src={favicon || "/placeholder.svg"}
            alt="Site favicon"
            className="h-8 w-8 rounded"
          />
        </div>

        {/* Link Info - Left Side */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-foreground">
              {shortUrl}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(shortUrl);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const ok = window.confirm("Delete this link?");
                if (!ok) return;
                try {
                  const res = await deleteLinkApi(id);
                  if (res.error) {
                    console.error("Delete failed:", res.error);
                    toast({
                      title: "Delete failed",
                      description:
                        res.error?.message || "Could not delete link",
                      variant: "error",
                    });
                    return;
                  }
                  // remove from local state
                  deleteLink(id);
                  toast({ title: "Deleted", description: "Link removed." });
                } catch (err) {
                  console.error(err);
                  toast({
                    title: "Delete failed",
                    description: String(err),
                    variant: "error",
                  });
                }
              }}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{fullUrl}</span>
            <span>•</span>
            <span className="flex-shrink-0">{createdAt}</span>
          </div>
          <Link
            href={`links/${id}`}
            className="block font-mono text-sm text-blue-900"
          >
            details
          </Link>
        </div>

        {/* Clicks - Right Side */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <MousePointer className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm font-medium text-foreground">
            {displayClicks}
          </span>
          <div
            className={cn("h-2 w-2 rounded-full", isActive ? "" : "bg-muted")}
            style={isActive ? { backgroundColor: "#04c40a" } : {}}
          />
        </div>
      </div>
    </a>
  );
}

export const LinkCard = React.memo(LinkCardInner);
