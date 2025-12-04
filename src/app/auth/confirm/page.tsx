"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();

        // Supabase magic links often put tokens in the URL hash (#)
        const hash = window.location.hash;
        const search = window.location.search;

        let params = new URLSearchParams();
        if (hash && hash.startsWith("#")) {
          params = new URLSearchParams(hash.slice(1));
        } else if (search) {
          params = new URLSearchParams(search);
        }

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (access_token) {
          // Set session client-side
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || undefined,
          });
          if (error) throw error;
          toast({ title: "Signed in", description: "You were signed in successfully.", variant: "success" });
          // Redirect to an /auth page (middleware allows /auth paths for unauthenticated users)
          router.replace("/auth");
          return;
        }

        // If tokens are not in the hash but in query (server flow), call server verify endpoint
        const token = params.get("token") || params.get("token_hash");
        if (token && type) {
          // Call our server-side confirm route (which will verify and set cookies)
          const resp = await fetch(`/auth/confirm?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`);
          if (resp.ok) {
            router.replace("/auth");
            return;
          }
          const json = await resp.json().catch(() => null);
          throw new Error(json?.error?.message || "Failed to verify token");
        }

        throw new Error("No token found in URL");
      } catch (err: any) {
        console.error("Confirm flow error:", err);
        toast({ title: "Sign-in failed", description: err?.message || String(err), variant: "error" });
        // Redirect to auth page so user can try again
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ backgroundColor: "#090909", border: "1px solid #2E2E2E" }}>
        {loading ? <div>Signing you in…</div> : <div>Redirecting…</div>}
      </div>
    </div>
  );
}
