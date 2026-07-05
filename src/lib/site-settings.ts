import { prisma } from "@/lib/prisma";
import type { SiteSettings, HeroSection, Service } from "@/types/public-api";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!settings) {
      return null;
    }

    return {
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
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function getHero(): Promise<HeroSection | null> {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!hero) {
      return null;
    }

    return {
      id: hero.id,
      title: hero.title,
      subtitle: hero.subtitle,
      badge: hero.badge,
      primaryCtaText: hero.primaryCtaText,
      primaryCtaLink: hero.primaryCtaLink,
      secondaryCtaText: hero.secondaryCtaText,
      secondaryCtaLink: hero.secondaryCtaLink,
      backgroundImage: hero.backgroundImage,
      overlayOpacity: hero.overlayOpacity,
      isActive: hero.isActive,
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return services.map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      shortDescription: service.shortDescription,
      icon: service.icon,
      image: service.image,
      features: service.features as string[],
      sortOrder: service.sortOrder,
      isActive: service.isActive,
      isFeatured: service.isFeatured,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}