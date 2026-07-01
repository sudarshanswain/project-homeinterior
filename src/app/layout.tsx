import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DynamicTheme } from "@/components/dynamic-theme";
import { siteConfig } from "@/config/site";
import { SiteSettings } from "@/types/public-api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/settings`, {
      next: { revalidate: 3600 },
    });
    
    if (res.ok) {
      const result = await res.json();
      const settings: SiteSettings | null = result.data;
      
      if (settings) {
        return {
          metadataBase: new URL(baseUrl),
          title: {
            default: settings.metaTitle || `${settings.companyName} | ${settings.tagline}`,
            template: `%s | ${settings.companyName}`,
          },
          description: settings.metaDescription || settings.description,
          keywords: settings.metaKeywords?.split(",").map(k => k.trim()) || [],
          openGraph: {
            title: settings.companyName,
            description: settings.description,
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title: settings.companyName,
            description: settings.description,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${playfair.variable} min-h-screen font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DynamicTheme />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
