import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase server client environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY). See https://supabase.com/dashboard/project/_/settings/api"
  );
}

export async function createClient(cookieStore?: ReturnType<typeof cookies>) {
  const cs = cookieStore ?? cookies();

  return createServerClient(supabaseUrl!, supabaseKey!,
    // cast to any because the library expects a specific cookie shape
    ({
      cookies: {
        async getAll() {
          return (await cs).getAll();
        },
        setAll(cookiesToSet: { name: any; value: any; options: any }[]) {
          try {
            (cookiesToSet || []).forEach(async ({ name, value, options }) =>
              (await cs).set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    } as unknown as any)
  );
}
