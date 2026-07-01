import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PortfolioProject, Category } from "@/types/public-api";

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    const data: PortfolioProject[] = projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      categoryId: project.categoryId,
      category: project.category as Category,
      location: project.location,
      area: project.area,
      budget: project.budget,
      duration: project.duration,
      isFeatured: project.isFeatured,
      status: project.status,
      publishedAt: project.publishedAt?.toISOString() || null,
      images: project.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isBefore: img.isBefore,
        pairId: img.pairId,
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}