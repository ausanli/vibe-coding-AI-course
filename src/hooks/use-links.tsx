"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

export type LinkShape = {
  id: string
  favicon: string
  shortUrl: string
  fullUrl: string
  description: string
  clicks: number
  createdAt: string
  isActive: boolean
}

type LinksContextValue = {
  links: LinkShape[]
  getLinkById: (id: string) => LinkShape | undefined
  createLink: (link: LinkShape) => void
  updateLink: (id: string, update: Partial<LinkShape>) => void
}

const LinksContext = createContext<LinksContextValue | null>(null)

const initialMockLinks: LinkShape[] = [
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

export function LinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<LinkShape[]>(initialMockLinks)

  const getLinkById = useCallback((id: string) => {
    return links.find(l => l.id === id)
  }, [links])

  const createLink = useCallback((link: LinkShape) => {
    setLinks(prev => [link, ...prev])
  }, [])

  const updateLink = useCallback((id: string, update: Partial<LinkShape>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...update } : l))
  }, [])

  const value = useMemo<LinksContextValue>(() => ({ links, getLinkById, createLink, updateLink }), [links, getLinkById, createLink, updateLink])

  return (
    <LinksContext.Provider value={value}>{children}</LinksContext.Provider>
  )
}

export function useLinks() {
  const ctx = useContext(LinksContext)
  if (!ctx) {
    throw new Error("useLinks must be used within a LinksProvider")
  }
  return ctx
}


