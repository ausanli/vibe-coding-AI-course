"use client";

import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { LinkCard } from "./link-card";
import { useLinks } from "@/hooks/use-links";
import type { Link } from "@/lib/supabase/frontend";

export default function DashboardContent() {
  const { links, createLink } = useLinks();

  // Adapter: DashboardHeader returns a `Link` (frontend DB shape) but
  // our LinksProvider expects a LinkShape (id and createdAt required).
  const handleCreate = (link: Link) => {
    const mapped = {
      id: link.id ?? Math.random().toString(36).slice(2, 9),
      favicon: link.favicon ?? "",
      shortUrl: link.shortUrl ?? "",
      fullUrl: link.fullUrl ?? "",
      description: link.description ?? "",
      clicks: link.clicks ?? 0,
      createdAt: link.createdAt
        ? new Date(link.createdAt).toLocaleString()
        : new Date().toLocaleString(),
      isActive: link.isActive ?? false,
    };
    createLink(mapped);
  };

  return (
    <>
      <DashboardHeader onCreate={handleCreate} />
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <LinkCard key={link.id} {...link} />
        ))}
      </div>
    </>
  );
}
