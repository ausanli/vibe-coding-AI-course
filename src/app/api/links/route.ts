import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in environment.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Create a server-side Supabase client that can read the auth cookie
    const serverSupabase = await createServerClient();
    const userRes = await serverSupabase.auth.getUser();
    const authUser = userRes.data?.user;
    if (!authUser) {
      return NextResponse.json(
        { data: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Use the service role client for privileged writes (bypass RLS)
    const service = createServiceClient(supabaseUrl, serviceRoleKey);

    // Ensure the user row exists in `users` table to satisfy FK constraint.
    // We upsert by id (will create if missing).
    const upsertUser = {
      id: authUser.id,
      email: authUser.email ?? null,
    };
    const { error: upsertErr } = await service.from("users").upsert(upsertUser);
    if (upsertErr) {
      console.error("Failed to upsert user row:", upsertErr);
      // Not fatal: continue and attempt insert; let DB return FK error if still missing
    }

    // Force the user_id to the authenticated user (ignore any client-supplied user_id)
    const toInsert = { ...body, user_id: authUser.id };

    const { data, error } = await service
      .from("links")
      .insert(toInsert)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ data: null, error }, { status: 400 });
    }

    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
