"use client";

import { useEffect, useState } from "react";
import useRealtime from "@/hooks/use-realtime";
import { getLink } from "@/lib/supabase/frontend";

/**
 * useLinkClicks
 * - Fetches initial clicks count for a link (via getLink)
 * - Subscribes to analytics INSERTs for that link and increments clicks in real time
 *
 * Returns { clicks, isLoading, error }
 */
export function useLinkClicks(linkId?: string) {
  const [clicks, setClicks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const { subscribeToLinkClicks, subscribeToLinkUpdates } = useRealtime();

  useEffect(() => {
    let mounted = true;
    if (!linkId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // fetch initial clicks from links table
    (async () => {
      try {
        const res = await getLink(linkId);
        if (!mounted) return;
        if (res.error) {
          setError(res.error);
          setIsLoading(false);
          return;
        }
        const link = res.data;
        setClicks(Number(link?.clicks ?? 0));
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setIsLoading(false);
      }
    })();

    // subscribe to links table updates and set authoritative clicks
    const off = subscribeToLinkUpdates(linkId, (payload: any) => {
      const newRow = payload?.new;
      if (newRow && typeof newRow.clicks !== "undefined") {
        setClicks(Number(newRow.clicks));
      }
    });

    return () => {
      mounted = false;
      try {
        if (typeof off === "function") off();
      } catch (e) {
        // ignore
      }
      // Do not call unsubscribeAll here because other components may rely on it
    };
  }, [linkId, subscribeToLinkClicks]);

  return { clicks, isLoading, error };
}

export default useLinkClicks;
