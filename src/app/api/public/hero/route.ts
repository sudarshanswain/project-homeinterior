import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/types/public-api";

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!hero) {
      return NextResponse.json({
        success: true,
        data: getDefaultHero(),
      });
    }

    const data: HeroSection = {
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}

function getDefaultHero(): HeroSection {
  return {
    id: "default",
    title: "Transform Your Space Into a Masterpiece",
    subtitle: "We create stunning, functional interiors that reflect your personality.",
    badge: "Premium Interior Design",
    primaryCtaText: "Get Free Consultation",
    primaryCtaLink: "#contact",
    secondaryCtaText: "View Our Portfolio",
    secondaryCtaLink: "#portfolio",
    backgroundImage: null,
    overlayOpacity: 60,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}