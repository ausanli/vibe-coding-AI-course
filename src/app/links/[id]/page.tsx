import { DashboardLayout } from "@/components/dashboard-layout"
import { LinkDetailHeader } from "@/components/link-detail-header"
import { LinkDetailForm } from "@/components/link-detail-form"

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <LinkDetailHeader shortUrl={`short.ly/${id}`} />
        <div className="p-8">
          <LinkDetailForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
