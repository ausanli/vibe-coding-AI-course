import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { LinkCard } from "@/components/link-card"

const mockLinks = [
  {
    id: "1",
    favicon: "https://www.google.com/favicon.ico",
    shortUrl: "short.ly/abc123",
    fullUrl: "https://www.example.com/very-long-url-path",
    description: "Marketing campaign landing page for Q1 2025",
    clicks: 1247,
    createdAt: "2 hours ago",
    isActive: true,
  },
  {
    id: "2",
    favicon: "https://github.com/favicon.ico",
    shortUrl: "short.ly/gh456",
    fullUrl: "https://github.com/vercel/next.js",
    description: "Next.js repository link for documentation",
    clicks: 892,
    createdAt: "5 hours ago",
    isActive: true,
  },
  {
    id: "3",
    favicon: "https://vercel.com/favicon.ico",
    shortUrl: "short.ly/vrc789",
    fullUrl: "https://vercel.com/docs/getting-started",
    description: "Vercel documentation for new team members",
    clicks: 2341,
    createdAt: "1 day ago",
    isActive: true,
  },
  {
    id: "4",
    favicon: "https://www.youtube.com/favicon.ico",
    shortUrl: "short.ly/yt321",
    fullUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Product demo video for social media",
    clicks: 5678,
    createdAt: "3 days ago",
    isActive: false,
  },
  {
    id: "5",
    favicon: "https://twitter.com/favicon.ico",
    shortUrl: "short.ly/tw654",
    fullUrl: "https://twitter.com/vercel/status/123456789",
    description: "Twitter announcement post",
    clicks: 423,
    createdAt: "1 week ago",
    isActive: true,
  },
]

export default function Page() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-8">
        <DashboardHeader />
        <div className="flex flex-col gap-3">
          {mockLinks.map((link) => (
            <LinkCard key={link.id} {...link} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
