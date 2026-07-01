import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Service } from "@/types/public-api";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const data: Service[] = services.map((service) => ({
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}