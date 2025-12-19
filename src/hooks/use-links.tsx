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
  deleteLink: (id: string) => void;
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

  // Listen for global link-created events (emitted by frontend.createLink)
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const r = ce.detail as any;
        if (!r) return;
        const mapped: LinkShape = {
          id: r.id ?? Math.random().toString(36).slice(2, 9),
          favicon: r.favicon ?? "",
          shortUrl: r.shortUrl ?? "",
          fullUrl: r.fullUrl ?? "",
          description: r.description ?? "",
          clicks: r.clicks ?? 0,
          createdAt: r.createdAt
            ? new Date(r.createdAt).toLocaleString()
            : new Date().toLocaleString(),
          isActive: r.isActive ?? false,
        };
        setLinks((prev) => [mapped, ...prev]);
      } catch (err) {
        console.error("Failed to handle supabase:link-created event", err);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "supabase:link-created",
        handler as EventListener
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "supabase:link-created",
          handler as EventListener
        );
      }
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

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo<LinksContextValue>(
    () => ({ links, getLinkById, createLink, updateLink, deleteLink }),
    [links, getLinkById, createLink, updateLink, deleteLink]
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
