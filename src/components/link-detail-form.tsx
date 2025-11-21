"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLinks } from "@/hooks/use-links"
import { RefreshCw, HelpCircle, Tag, Folder, Target, Calendar, Lock, TrendingUp } from "lucide-react"

export function LinkDetailForm({ id }: { id: string }) {
  const { getLinkById, updateLink } = useLinks()
  const link = getLinkById(id)
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Short Link Section */}
      <div className="space-y-2">
        <Label htmlFor="short-link">Short Link</Label>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 border border-border">
            <Select defaultValue="links.sh" onValueChange={() => {}}>
              <SelectTrigger className="w-[140px] border-0 border-r border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="links.sh">links.sh</SelectItem>
                <SelectItem value="short.ly">short.ly</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="short-link"
              defaultValue={link?.shortUrl.split("/").pop() ?? ""}
              onChange={(e) => {
                const domain = (link?.shortUrl.includes("/") ? link?.shortUrl.split("/")[0] : "short.ly") || "short.ly"
                updateLink(id, { shortUrl: `${domain}/${e.target.value}` })
              }}
              className="flex-1 border-0 focus-visible:ring-0"
            />
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tags">Tags</Label>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="tags" placeholder="Select tags" className="pl-10" />
        </div>
      </div>

      {/* Conversion Tracking Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="conversion-tracking">Conversion Tracking</Label>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <Switch id="conversion-tracking" />
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Folder Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="folder">Folder</Label>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <Select defaultValue="links" onValueChange={() => {}}>
          <SelectTrigger id="folder">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: "#1c2b1c" }}>
                <Folder className="h-3.5 w-3.5" style={{ color: "#04C40A" }} />
              </div>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="links">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded"
                  style={{ backgroundColor: "#1c2b1c" }}
                >
                  <Folder className="h-3.5 w-3.5" style={{ color: "#04C40A" }} />
                </div>
                Links
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add a short description here…"
          defaultValue={link?.description ?? ""}
          onChange={(e) => updateLink(id, { description: e.target.value })}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Chips Section */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <TrendingUp className="h-4 w-4" />
          UTM
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Target className="h-4 w-4" />
          Targeting
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Expiration
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Lock className="h-4 w-4" />
          Password
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Footer Section */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Created by adamsmith@gmail.com</span>
        <span>•</span>
        <span>2 hours ago</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={() => { /* no-op for mock flow */ }}>Save</Button>
      </div>
    </div>
  )
}
