import { createClient } from "./client";

// Minimal types for the frontend helpers
export type User = {
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  id?: string;
};

export type Link = {
  id?: string;
  createdAt?: string | null;
  user_id?: string | null;
  shortUrl: string;
  fullUrl: string;
  tags?: string[] | string | null;
  isActive: boolean;
  favicon?: string | null;
  slug?: string | null;
  description: string;
  clicks: number;
};

export type Analytics = {
  totalClicks: number;
  linkCount: number;
  perLink: Array<{ id: string; shortUrl?: string | null; clicks: number }>;
};

// Helper result wrapper
type Result<T> = Promise<{ data: T | null; error: any | null }>;

const supabase = createClient();

/**
 * Fetch a user by id or the currently authenticated user (if no id provided).
 * Tries to read a `profiles` row first (common Supabase convention). If not found,
 * falls back to the auth user object.
 */
export async function getUser(userId?: string): Result<User> {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) return { data: null, error };
      if (data) return { data: data as User, error: null };
    }

    // no id provided — try auth user
    const authRes = await supabase.auth.getUser();
    if (authRes.error) return { data: null, error: authRes.error };
    const authUser = authRes.data?.user;
    if (!authUser) return { data: null, error: null };

    // try users table for extra metadata
    const { data: profile, error: profileErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();
    if (profileErr) return { data: null, error: profileErr };
    return { data: (profile || authUser) as User, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update a user's profile row in `profiles` table (or `users` as fallback).
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>
): Result<User> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...updates })
      .select()
      .maybeSingle();
    if (error) {
      // try users table as fallback
      const { data: u, error: ue } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .maybeSingle();
      return { data: (u || null) as User | null, error: ue || null };
    }
    return { data: (data || null) as User | null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get a link row by id from `links` table.
 */
export async function getLink(id: string): Result<Link> {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return { data: null, error };
    const r = data as any;
    if (!r) return { data: null, error: null };
    const mapped: Link = {
      id: r.id,
      createdAt: r.createdAt ?? r.created_at ?? null,
      user_id: r.user_id ?? r.userId ?? null,
      shortUrl: r.shortUrl ?? r.shortUrl ?? "",
      fullUrl: r.fullUrl ?? r.full_url ?? "",
      tags: r.tags ?? null,
      isActive: r.isActive ?? r.is_active ?? false,
      description: r.description ?? null,
      favicon: r.favicon ?? null,
      clicks: r.clicks ?? 0,
      slug: r.slug ?? null,
    };
    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update a link by id. Returns the updated row.
 */
export async function updateLink(
  id: string,
  updates: Partial<Link>
): Result<Link> {
  try {
    const { data, error } = await supabase
      .from("links")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) return { data: null, error };
    const r = data as any;
    const mapped: Link = {
      id: r.id,
      createdAt: r.createdAt ?? r.created_at ?? null,
      user_id: r.user_id ?? r.userId ?? null,
      shortUrl: r.shortUrl ?? r.shortUrl ?? "",
      fullUrl: r.fullUrl ?? r.full_url ?? "",
      tags: r.tags ?? null,
      isActive: r.isActive ?? r.is_active ?? false,
      description: r.description ?? null,
      favicon: r.favicon ?? null,
      clicks: r.clicks ?? 0,
      slug: r.slug ?? null,
    };
    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Delete a link by id. Returns deleted row (if DB returns it) or null.
 */
export async function deleteLink(id: string): Result<Link> {
  try {
    const { data, error } = await supabase
      .from("links")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) return { data: null, error };
    const r = data as any;
    if (!r) return { data: null, error: null };
    const mapped: Link = {
      id: r.id,
      createdAt: r.createdAt ?? r.created_at ?? null,
      user_id: r.user_id ?? r.userId ?? null,
      shortUrl: r.shortUrl ?? r.shortUrl ?? "",
      fullUrl: r.fullUrl ?? r.full_url ?? "",
      tags: r.tags ?? null,
      isActive: r.isActive ?? r.is_active ?? false,
      description: r.description ?? null,
      favicon: r.favicon ?? null,
      clicks: r.clicks ?? 0,
      slug: r.slug ?? null,
    };
    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Create a new link. Returns the created row.
 */
export async function createLink(link: Link): Result<Link> {
  try {
    // Insert using camelCase field names (server/back-end expects these fields).
    const toInsert: any = {
      ...(link as any),
    };

    const { data, error } = await supabase
      .from("links")
      .insert(toInsert)
      .select()
      .maybeSingle();
    if (error) return { data: null, error };
    const r = data as any;
    const mapped: Link = {
      id: r.id,
      createdAt: r.createdAt ?? r.created_at ?? null,
      user_id: r.user_id ?? r.userId ?? null,
      shortUrl: r.shortUrl ?? r.shortUrl ?? "",
      fullUrl: r.fullUrl ?? r.full_url ?? "",
      tags: r.tags ?? null,
      isActive: r.isActive ?? r.is_active ?? false,
      description: r.description ?? null,
      favicon: r.favicon ?? null,
      clicks: r.clicks ?? 0,
      slug: r.slug ?? null,
    };
    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Simple analytics: fetch links (optionally filtered by userId) and compute totals.
 * Returns total clicks, link count and per-link clicks.
 */
export async function getAnalytics(userId?: string): Result<Analytics> {
  try {
    let q = supabase.from("links").select("id, shortUrl, clicks");
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) return { data: null, error };
    const rows = (data || []) as Array<{
      id: string;
      shortUrl?: string | null;
      clicks?: number | null;
    }>;
    const perLink = rows.map((r) => ({
      id: r.id,
      shortUrl: r.shortUrl ?? null,
      clicks: r.clicks ?? 0,
    }));
    const totalClicks = perLink.reduce((s, p) => s + (p.clicks || 0), 0);
    return {
      data: { totalClicks, linkCount: perLink.length, perLink },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Fetch links. Optionally filter by userId.
 */
export async function getLinks(
  userId?: string
): Promise<{ data: Link[] | null; error: any | null }> {
  try {
    let q = supabase
      .from("links")
      .select(
        "id, favicon, shortUrl, fullUrl, description, clicks, createdAt, isActive"
      );
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    console.log(data);
    if (error) return { data: null, error };

    const rows = (data || []) as Array<any>;
    const mapped: Link[] = rows.map((r) => ({
      id: r.id,
      favicon: r.favicon ?? "",
      shortUrl: r.shortUrl ?? r.shortUrl ?? "",
      fullUrl: r.full_url ?? r.fullUrl ?? "",
      description: r.description ?? "",
      clicks: r.clicks ?? 0,
      createdAt: r.created_at ?? r.createdAt ?? null,
      isActive: r.is_active ?? r.isActive ?? false,
    }));

    return { data: mapped, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export default {
  getUser,
  updateUser,
  getLink,
  updateLink,
  deleteLink,
  createLink,
  getAnalytics,
};
