import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in environment." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.from("links").insert(body).select().maybeSingle();

    if (error) {
      return NextResponse.json({ data: null, error }, { status: 400 });
    }

    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: err?.message || String(err) }, { status: 500 });
  }
}
