"use client";

import { useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type AnalyticsRow = {
  id: string;
  link_id: string;
  created_at?: string;
  /* other fields */
};

type Unsubscribe = () => Promise<void> | void;

/**
 * useRealtime - provides helpers to subscribe to realtime Postgres changes via Supabase
 *
 * API:
 * const { subscribeToLinkClicks, unsubscribeAll } = useRealtime()
 * const off = subscribeToLinkClicks(linkId, (payload) => { ... })
 * off() // unsubscribe for that link
 */
export function useRealtime() {
  const supabaseRef = useRef<any | null>(null);
  const channelsRef = useRef<Map<string, any>>(new Map());

  // initialize client once
  useEffect(() => {
    supabaseRef.current = createClient();
    return () => {
      // cleanup all channels on unmount
      const supabase = supabaseRef.current;
      if (!supabase) return;
      try {
        channelsRef.current.forEach((ch) => {
          if (ch.unsubscribe) ch.unsubscribe();
          else if (supabase.removeChannel) supabase.removeChannel(ch);
        });
      } catch (e) {
        // ignore
      }
      channelsRef.current.clear();
    };
  }, []);

  const subscribeToLinkClicks = useCallback(
    (linkId: string, handler: (payload: any) => void): Unsubscribe => {
      const supabase = supabaseRef.current;
      if (!supabase) {
        console.warn("Supabase client not initialized for realtime");
        return () => {};
      }

      const channelName = `analytics-link-${linkId}`;
      // Prevent creating duplicate channel for same link
      if (channelsRef.current.has(channelName)) {
        const existing = channelsRef.current.get(channelName);
        // allow multiple handlers by wrapping
        existing.handlers = existing.handlers || [];
        existing.handlers.push(handler);
        return () => {
          existing.handlers = existing.handlers.filter(
            (h: any) => h !== handler
          );
        };
      }

      const ch = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "analytics",
            filter: `link_id=eq.${linkId}`,
          },
          (payload: { new: AnalyticsRow; old?: any; eventType?: string }) => {
            try {
              handler(payload);
              // also dispatch to other attached handlers
              const stored = channelsRef.current.get(channelName);
              if (stored && stored.handlers) {
                stored.handlers.forEach((h: any) => {
                  if (h !== handler) h(payload);
                });
              }
            } catch (e) {
              console.error("realtime handler error", e);
            }
          }
        )
        .subscribe();

      channelsRef.current.set(channelName, { channel: ch, handlers: [] });

      const unsubscribe = async () => {
        try {
          if (ch.unsubscribe) await ch.unsubscribe();
          else if (supabase.removeChannel) await supabase.removeChannel(ch);
        } catch (e) {
          console.warn("Error unsubscribing channel", e);
        } finally {
          channelsRef.current.delete(channelName);
        }
      };

      return unsubscribe;
    },
    []
  );

  const subscribeToLinkUpdates = useCallback(
    (linkId: string, handler: (payload: any) => void): Unsubscribe => {
      const supabase = supabaseRef.current;
      if (!supabase) {
        console.warn("Supabase client not initialized for realtime");
        return () => {};
      }

      const channelName = `links-${linkId}`;
      if (channelsRef.current.has(channelName)) {
        const existing = channelsRef.current.get(channelName);
        existing.handlers = existing.handlers || [];
        existing.handlers.push(handler);
        return () => {
          existing.handlers = existing.handlers.filter(
            (h: any) => h !== handler
          );
        };
      }

      const ch = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "links",
            filter: `id=eq.${linkId}`,
          },
          (payload: { new: any; old?: any; eventType?: string }) => {
            try {
              handler(payload);
              const stored = channelsRef.current.get(channelName);
              if (stored && stored.handlers) {
                stored.handlers.forEach((h: any) => {
                  if (h !== handler) h(payload);
                });
              }
            } catch (e) {
              console.error("realtime handler error", e);
            }
          }
        )
        .subscribe();

      channelsRef.current.set(channelName, { channel: ch, handlers: [] });

      const unsubscribe = async () => {
        try {
          if (ch.unsubscribe) await ch.unsubscribe();
          else if (supabase.removeChannel) await supabase.removeChannel(ch);
        } catch (e) {
          console.warn("Error unsubscribing channel", e);
        } finally {
          channelsRef.current.delete(channelName);
        }
      };

      return unsubscribe;
    },
    []
  );

  const unsubscribeAll = useCallback(async () => {
    const supabase = supabaseRef.current;
    channelsRef.current.forEach(async (entry, name) => {
      try {
        const ch = entry.channel;
        if (!ch) return;
        if (ch.unsubscribe) await ch.unsubscribe();
        else if (supabase?.removeChannel) await supabase.removeChannel(ch);
      } catch (e) {
        // ignore
      }
    });
    channelsRef.current.clear();
  }, []);

  return {
    subscribeToLinkClicks,
    subscribeToLinkUpdates,
    unsubscribeAll,
  };
}

export default useRealtime;
