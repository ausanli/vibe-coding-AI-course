import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  // create a server-side supabase client (uses server keys / cookie store)
  const supabase = await createClient(cookies());

  try {
    // Try exact match first (short_url stored as full string like 'links.sh/p0g8x1e')
    let { data: link, error } = await supabase
      .from("links")
      .select("id, full_url, short_url")
      .eq("short_url", slug)
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase error looking up link by exact short_url:",
        error
      );
      // continue to try alternate lookup
    }

    // If not found, try matching the trailing path segment (e.g. slug = 'p0g8x1e')
    if (!link) {
      const like = `%/${slug}`;
      const res = await supabase
        .from("links")
        .select("id, full_url, short_url")
        .like("short_url", like)
        .limit(1)
        .maybeSingle();
      link = res.data as any;
      if (res.error)
        console.error(
          "Supabase error looking up link by trailing slug:",
          res.error
        );
    }

    if (!link || !link.full_url) {
      // destination not found — redirect to a 302 error page
      const redirectUrl = new URL(
        "/302",
        process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000"
      );
      return NextResponse.redirect(redirectUrl, 302);
    }

    // Log analytic row (server-side so we can bypass RLS)
    try {
      await supabase
        .from("analytics")
        .insert({ link_id: link.id, clicked_at: new Date().toISOString() });
    } catch (e) {
      console.error("Failed to insert analytics row:", e);
      // continue — don't block redirect on analytics failure
    }

    // Redirect the user to the destination URL
    return NextResponse.redirect(link.full_url);
  } catch (err) {
    console.error("Unexpected error in redirect route:", err);
    const redirectUrl = new URL(
      "/302",
      process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000"
    );
    return NextResponse.redirect(redirectUrl, 302);
  }
}
