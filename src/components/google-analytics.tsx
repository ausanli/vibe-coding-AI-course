"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

type GAProps = {
  measurementId?: string;
};

export default function GoogleAnalytics({ measurementId }: GAProps) {
  const pathname = usePathname();
  const GA_ID =
    measurementId ?? process.env.NEXT_PUBLIC_GA_ID ?? "G-L0M09E90Z4";

  useEffect(() => {
    if (!GA_ID) return;

    // Inject gtag script if not already present
    if (
      !document.querySelector(
        `script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`
      )
    ) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    }

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };

    // Standard initialization snippet
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { page_path: window.location.pathname });
  }, [GA_ID]);

  // Send page_view on route changes (single-page navigation)
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag("config", GA_ID, { page_path: pathname });
  }, [GA_ID, pathname]);

  return null;
}
