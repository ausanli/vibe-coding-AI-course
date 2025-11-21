"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, Search } from "lucide-react"
import { useState } from "react"
import { LinkModal } from "./link-modal"
import { useLinks } from "@/hooks/use-links"
import { useToast } from "@/hooks/use-toast"

type LinkShape = {
  id: string
  favicon: string
  shortUrl: string
  fullUrl: string
  description: string
  clicks: number
  createdAt: string
  isActive: boolean
}

export function DashboardHeader({ onCreate }: { onCreate?: (link: LinkShape) => void }) {
  const { createLink } = useLinks()
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(link) => {
          try {
            createLink(link)
            onCreate?.(link)
            toast({
              title: "Success!",
              description: "Link created and added to your dashboard.",
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to add link to dashboard. Please try again.",
              variant: "error",
            })
          }
        }}
      />
      {/* Title and Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">Links</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: "#1F1F1F" }}>
              <Plus className="h-4 w-4" />
              Create link
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>Create new link</DropdownMenuItem>
            <DropdownMenuItem>Import from CSV</DropdownMenuItem>
            <DropdownMenuItem>Bulk create</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Display
          </Button>
          <Button variant="outline" size="sm">
            Bulk actions
          </Button>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search links..." className="pl-9" />
        </div>
      </div>
    </div>
  )
}
