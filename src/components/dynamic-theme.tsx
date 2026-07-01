"use client";

import { useEffect } from "react";
import { usePublicData } from "@/hooks/use-public-data";
import { SiteSettings } from "@/types/public-api";

export function DynamicTheme() {
  const { data: settings } = usePublicData<SiteSettings>("/api/public/settings");

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    
    // Set CSS variables for colors
    if (settings.primaryColor) {
      root.style.setProperty("--color-primary", settings.primaryColor);
      root.style.setProperty("--primary", settings.primaryColor);
    }
    
    if (settings.secondaryColor) {
      root.style.setProperty("--color-secondary", settings.secondaryColor);
      root.style.setProperty("--secondary", settings.secondaryColor);
    }
    
    if (settings.accentColor) {
      root.style.setProperty("--color-accent", settings.accentColor);
      root.style.setProperty("--accent", settings.accentColor);
    }

    // Update favicon if provided
    if (settings.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = settings.favicon;
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = settings.favicon;
        document.head.appendChild(link);
      }
    }
  }, [settings]);

  return null;
}