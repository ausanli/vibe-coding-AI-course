import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: Request, context: any) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in environment.",
      },
      { status: 500 }
    );
  }

  const rawSlug = context?.params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  if (!slug) {
    return NextResponse.redirect(new URL("/302", req.url));
  }

  try {
    const service = createServiceClient(supabaseUrl, serviceRoleKey);

    // Find link by slug
    const { data: link, error: fetchErr } = await service
      .from("links")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (fetchErr) {
      console.error("Error fetching link by slug:", fetchErr);
      return NextResponse.redirect(new URL("/302", req.url));
    }

    if (!link) {
      return NextResponse.redirect(new URL("/302", req.url));
    }

    // Increment clicks (best-effort; not perfectly atomic without a SQL function)
    try {
      const newClicks = (link.clicks ?? 0) + 1;
      await service
        .from("links")
        .update({ clicks: newClicks })
        .eq("id", link.id);
    } catch (e) {
      console.warn("Failed to increment clicks:", e);
    }

    // Insert analytics row (best-effort)
    try {
      await service.from("analytics").insert({ link_id: link.id });
    } catch (e) {
      console.warn("Failed to insert analytics row:", e);
    }

    const destination = link.fullUrl || "/302";
    return NextResponse.redirect(destination);
  } catch (err: any) {
    console.error("Redirect error:", err);
    return NextResponse.json(
      { data: null, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
