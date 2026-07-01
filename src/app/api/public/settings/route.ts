import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteSettings } from "@/types/public-api";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: getDefaultSettings(),
      });
    }

    const data: SiteSettings = {
      id: settings.id,
      companyName: settings.companyName,
      tagline: settings.tagline,
      description: settings.description,
      logo: settings.logo,
      favicon: settings.favicon,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      phone: settings.phone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      addressLine1: settings.addressLine1,
      addressLine2: settings.addressLine2,
      city: settings.city,
      state: settings.state,
      country: settings.country,
      postalCode: settings.postalCode,
      facebook: settings.facebook,
      instagram: settings.instagram,
      linkedin: settings.linkedin,
      youtube: settings.youtube,
      twitter: settings.twitter,
      pinterest: settings.pinterest,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      metaKeywords: settings.metaKeywords,
      googleAnalyticsId: settings.googleAnalyticsId,
      googleTagManagerId: settings.googleTagManagerId,
      facebookPixelId: settings.facebookPixelId,
      copyrightText: settings.copyrightText,
      defaultLanguage: settings.defaultLanguage,
      timezone: settings.timezone,
      currency: settings.currency,
      maintenanceMode: settings.maintenanceMode,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({
      success: true,
      data: getDefaultSettings(),
    });
  }
}

function getDefaultSettings(): SiteSettings {
  return {
    id: "default",
    companyName: "HomeInterior",
    tagline: "Luxury Interior Design, Crafted for You",
    description: "Premium interior design services for homes, apartments, and villas.",
    logo: null,
    favicon: null,
    primaryColor: "#0f172a",
    secondaryColor: "#1e293b",
    accentColor: "#f59e0b",
    phone: "+91 98765 43210",
    email: "hello@homeinterior.local",
    whatsapp: "919876543210",
    addressLine1: "123 Design Avenue",
    addressLine2: null,
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400050",
    facebook: null,
    instagram: null,
    linkedin: null,
    youtube: null,
    twitter: null,
    pinterest: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    googleAnalyticsId: null,
    googleTagManagerId: null,
    facebookPixelId: null,
    copyrightText: null,
    defaultLanguage: "en",
    timezone: "Asia/Kolkata",
    currency: "INR",
    maintenanceMode: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
