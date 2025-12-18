"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Search } from "lucide-react";
import { useState } from "react";
import { LinkModal } from "./link-modal";
import { useToast } from "@/hooks/use-toast";
import type { Link } from "@/lib/supabase/frontend";

export function DashboardHeader({
  onCreate,
}: {
  onCreate?: (link: Link) => void;
}) {
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (link) => {
          try {
            const res = await fetch(`/api/links`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(link),
            });
            const payload = await res.json();
            if (!res.ok) {
              console.error("Create link failed:", payload);
              toast({
                title: "Error",
                description: payload?.error?.message || "Failed to create link",
                variant: "error",
              });
              return;
            }

            const created = payload.data as Link;
            onCreate?.(created || link);
            toast({
              title: "Success!",
              description: "Link created and added to your dashboard.",
            });
          } catch (error: any) {
            console.error(error);
            toast({
              title: "Error",
              description: error?.message || String(error),
              variant: "error",
            });
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
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              Create new link
            </DropdownMenuItem>
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
  );
}
