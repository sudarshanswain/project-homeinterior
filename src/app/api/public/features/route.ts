import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Feature } from "@/types/public-api";

export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const data: Feature[] = features.map((feature) => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      sortOrder: feature.sortOrder,
      isActive: feature.isActive,
      isFeatured: feature.isFeatured,
      createdAt: feature.createdAt.toISOString(),
      updatedAt: feature.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}