import { Button } from "@/components/ui/button"
import { ChevronRight, Copy, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface LinkDetailHeaderProps {
  shortUrl: string
}

export function LinkDetailHeader({ shortUrl }: LinkDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-8 py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Links
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-mono text-foreground">{shortUrl}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
