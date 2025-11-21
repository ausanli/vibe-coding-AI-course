"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { LinkDetailHeader } from "@/components/link-detail-header"
import { LinkDetailForm } from "@/components/link-detail-form"
import { useLinks } from "@/hooks/use-links"
import { use as usePromise } from "react"

export default function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params)
  const { getLinkById } = useLinks()
  const link = getLinkById(id)

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <LinkDetailHeader shortUrl={link?.shortUrl ?? `short.ly/${id}`} />
        <div className="p-8">
          <LinkDetailForm id={id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
