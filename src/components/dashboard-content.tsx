"use client";

import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { LinkCard } from "./link-card";
import { useLinks } from "@/hooks/use-links";

export default function DashboardContent() {
  const { links } = useLinks();

  return (
    <>
      <DashboardHeader />
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <LinkCard key={link.id} {...link} />
        ))}
      </div>
    </>
  );
}
