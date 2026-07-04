import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { processImage, deleteImage } from "@/lib/media-utils";
import type { PortfolioImageInput, PortfolioVideoInput } from "@/types/portfolio";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.portfolioProject.findMany({
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        videos: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, categoryId, location, area, budget, duration, isFeatured, status, images, videos } = body;

    // Validate slug uniqueness
    const existing = await prisma.portfolioProject.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 }
      );
    }

    // Create project with images and videos in a transaction
    const project = await prisma.portfolioProject.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        location,
        area,
        budget,
        duration,
        isFeatured,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        images: {
          create: (images as PortfolioImageInput[])?.map((img, index) => ({
            url: img.url,
            thumbnail: img.thumbnail,
            alt: img.alt,
            sortOrder: index,
            type: (img.type || "IMAGE") as "IMAGE" | "VIDEO",
            fileSize: img.fileSize,
            mimeType: img.mimeType,
            width: img.width,
            height: img.height,
          })) || [],
        },
        videos: {
          create: (videos as PortfolioVideoInput[])?.map((video, index) => ({
            type: (video.type || "UPLOAD") as "UPLOAD" | "YOUTUBE" | "VIMEO",
            url: video.url,
            thumbnail: video.thumbnail,
            title: video.title,
            sortOrder: index,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        videos: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}