import { createClient } from "./client";

// Minimal types for the frontend helpers
export type User = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  [key: string]: any;
};

export type Link = {
  id?: string;
  favicon?: string | null;
  short_url: string;
  full_url: string;
  description?: string | null;
  clicks?: number | null;
  created_at?: string | null;
  is_active?: boolean | null;
  user_id?: string | null;
  [key: string]: any;
};

export type Analytics = {
  totalClicks: number;
  linkCount: number;
  perLink: Array<{ id: string; short_url?: string | null; clicks: number }>;
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
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) return { data: null, error };
      if (data) return { data: data as User, error: null };
      // fallback to users table
      const { data: u, error: ue } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (ue) return { data: null, error: ue };
      return { data: (u || null) as User | null, error: null };
    }

    // no id provided — try auth user
    const authRes = await supabase.auth.getUser();
    if (authRes.error) return { data: null, error: authRes.error };
    const authUser = authRes.data?.user;
    if (!authUser) return { data: null, error: null };

    // try profiles table for extra metadata
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
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
    return { data: (data || null) as Link | null, error: null };
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
    return { data: (data || null) as Link | null, error: null };
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
    return { data: (data || null) as Link | null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Create a new link. Returns the created row.
 */
export async function createLink(link: Link): Result<Link> {
  try {
    const { data, error } = await supabase
      .from("links")
      .insert(link)
      .select()
      .maybeSingle();
    if (error) return { data: null, error };
    return { data: (data || null) as Link | null, error: null };
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
    let q = supabase.from("links").select("id, short_url, clicks");
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) return { data: null, error };
    const rows = (data || []) as Array<{
      id: string;
      short_url?: string | null;
      clicks?: number | null;
    }>;
    const perLink = rows.map((r) => ({
      id: r.id,
      short_url: r.short_url ?? null,
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

export default {
  getUser,
  updateUser,
  getLink,
  updateLink,
  deleteLink,
  createLink,
  getAnalytics,
};
