"use client"

import { Button } from "@/components/ui/button"
import { Copy, MousePointer } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface LinkCardProps {
  id: string
  favicon: string
  shortUrl: string
  fullUrl: string
  description: string
  clicks: number
  createdAt: string
  isActive: boolean
}

export function LinkCard({ id, favicon, shortUrl, fullUrl, clicks, createdAt, isActive }: LinkCardProps) {
  return (
    <Link href={`/links/${id}`} className="block">
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
            <span className="font-mono text-sm font-medium text-foreground">{shortUrl}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault()
                navigator.clipboard.writeText(shortUrl)
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{fullUrl}</span>
            <span>•</span>
            <span className="flex-shrink-0">{createdAt}</span>
          </div>
        </div>

        {/* Clicks - Right Side */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <MousePointer className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm font-medium text-foreground">{clicks.toLocaleString()}</span>
          <div
            className={cn("h-2 w-2 rounded-full", isActive ? "" : "bg-muted")}
            style={isActive ? { backgroundColor: "#04c40a" } : {}}
          />
        </div>
      </div>
    </Link>
  )
}
