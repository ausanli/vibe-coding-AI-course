"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type LinkShape = {
  id: string;
  favicon: string;
  shortUrl: string;
  fullUrl: string;
  description: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
};

type LinksContextValue = {
  links: LinkShape[];
  getLinkById: (id: string) => LinkShape | undefined;
  createLink: (link: LinkShape) => void;
  updateLink: (id: string, update: Partial<LinkShape>) => void;
};

const LinksContext = createContext<LinksContextValue | null>(null);

import { getLinks } from "@/lib/supabase/frontend";

export function LinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<LinkShape[]>([]);

  // Load links from the backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getLinks();
        if (!mounted) return;
        if (res.error) {
          console.error("Failed to load links:", res.error);
          return;
        }
        const rows = res.data || [];
        const mapped: LinkShape[] = rows.map((r) => ({
          id: r.id ?? Math.random().toString(36).slice(2, 9),
          favicon: r.favicon || "",
          shortUrl: r.shortUrl || "",
          fullUrl: r.fullUrl || "",
          description: r.description || "",
          clicks: r.clicks || 0,
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
          isActive: r.isActive ?? false,
        }));
        setLinks(mapped);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getLinkById = useCallback(
    (id: string) => {
      return links.find((l) => l.id === id);
    },
    [links]
  );

  const createLink = useCallback((link: LinkShape) => {
    setLinks((prev) => [link, ...prev]);
  }, []);

  const updateLink = useCallback((id: string, update: Partial<LinkShape>) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...update } : l))
    );
  }, []);

  const value = useMemo<LinksContextValue>(
    () => ({ links, getLinkById, createLink, updateLink }),
    [links, getLinkById, createLink, updateLink]
  );

  return (
    <LinksContext.Provider value={value}>{children}</LinksContext.Provider>
  );
}

export function useLinks() {
  const ctx = useContext(LinksContext);
  if (!ctx) {
    throw new Error("useLinks must be used within a LinksProvider");
  }
  return ctx;
}
