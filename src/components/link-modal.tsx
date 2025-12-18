"use client";

import type React from "react";
import { useState } from "react";
import {
  X,
  HelpCircle,
  RefreshCw,
  Tag,
  LinkIcon,
  Calendar,
  Lock,
  Target,
  BarChart3,
  FolderIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/lib/supabase/frontend";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (link: Link) => void;
}

export function LinkModal({ isOpen, onClose, onCreate }: LinkModalProps) {
  const { toast } = useToast();

  const [fullUrl, setFullUrl] = useState("");
  const [domain, setDomain] = useState("links.sh");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [favicon, setFavicon] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-5xl bg-card rounded-lg shadow-lg max-h-[90vh] overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left Column */}
          <div className="p-6 space-y-6">
            {/* Breadcrumbs */}
            <div className="text-sm text-muted-foreground">
              Links &gt; New Link
            </div>

            {/* Destination URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Destination URL</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="url"
                placeholder="https://example.com/subdomain-here"
                className="w-full"
                value={fullUrl}
                onChange={(e) => setFullUrl(e.target.value)}
              />
            </div>

            {/* Short Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Short Link</label>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Select value={domain} onValueChange={(v) => setDomain(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="links.sh">links.sh</SelectItem>
                    <SelectItem value="short.io">short.io</SelectItem>
                    <SelectItem value="bit.ly">bit.ly</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="slug (e.g. p0g8x1e)"
                  className="flex-1"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Tags</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="tag1, tag2"
                  className="pl-10"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Conversion Tracking */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">
                  Conversion Tracking
                </label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Switch />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <BarChart3 className="h-4 w-4" />
                UTM
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Target className="h-4 w-4" />
                Targeting
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Calendar className="h-4 w-4" />
                Expiration
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Lock className="h-4 w-4" />
                Password
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="p-6 space-y-6 relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Folder */}
            <div className="space-y-2 mt-8">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Folder</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select defaultValue="links">
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: "#1c2b1c" }}
                    >
                      <FolderIcon
                        className="h-3 w-3"
                        style={{ color: "#04C40A" }}
                      />
                    </div>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="links">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded flex items-center justify-center"
                        style={{ backgroundColor: "#1c2b1c" }}
                      >
                        <FolderIcon
                          className="h-3 w-3"
                          style={{ color: "#04C40A" }}
                        />
                      </div>
                      Links
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Favicon URL</label>
              <Input
                type="url"
                placeholder="https://example.com/favicon.ico"
                className="w-full"
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Add a short description here..."
                className="min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Active</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(v) => setIsActive(Boolean(v))}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Create Link Button */}
            <Button
              className="w-full gap-2"
              onClick={() => {
                try {
                  const slugValue =
                    slug || Math.random().toString(36).slice(2, 8);
                  const short = `${domain}/${slugValue}`;
                  const tagArray = tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);

                  const link: Link = {
                    favicon: favicon || undefined,
                    shortUrl: short,
                    fullUrl: fullUrl || "",
                    description: description || undefined,
                    clicks: 0,
                    isActive: Boolean(isActive),
                    tags: tagArray.length ? tagArray : undefined,
                    slug: slugValue,
                  } as Link;

                  onCreate?.(link);
                  onClose();

                  toast({
                    title: "Success!",
                    description: "Link created successfully.",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to create link. Please try again.",
                    variant: "error",
                  });
                }
              }}
            >
              <LinkIcon className="h-4 w-4" />
              Create Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
