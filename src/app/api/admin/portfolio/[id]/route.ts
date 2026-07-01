import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/media-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        videos: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, categoryId, location, area, budget, duration, isFeatured, status, images, videos } = body;

    // Check if project exists
    const existing = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check slug uniqueness (excluding current project)
    const slugExists = await prisma.portfolioProject.findFirst({
      where: {
        slug,
        id: { not: params.id },
      },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 }
      );
    }

    // Delete old images and videos
    const oldProject = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: { images: true, videos: true },
    });

    if (oldProject) {
      for (const img of oldProject.images) {
        deleteImage(img.url, img.thumbnail || "");
      }
    }

    // Update project with new images and videos
    const project = await prisma.portfolioProject.update({
      where: { id: params.id },
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
          delete: true,
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            thumbnail: img.thumbnail,
            alt: img.alt,
            sortOrder: index,
            type: img.type || "IMAGE",
            fileSize: img.fileSize,
            mimeType: img.mimeType,
            width: img.width,
            height: img.height,
          })) || [],
        },
        videos: {
          delete: true,
          create: videos?.map((video: any, index: number) => ({
            type: video.type || "UPLOAD",
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

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get project with images and videos
    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: { images: true, videos: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete image files
    for (const img of project.images) {
      deleteImage(img.url, img.thumbnail || "");
    }

    // Delete project (cascade will delete database records)
    await prisma.portfolioProject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}