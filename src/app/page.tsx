"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { LinkCard } from "@/components/link-card"
import { useLinks } from "@/hooks/use-links"

export default function Page() {
  const { links } = useLinks()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-8">
        <DashboardHeader />
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <LinkCard key={link.id} {...link} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
