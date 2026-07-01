import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Testimonial } from "@/types/public-api";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    });

    const data: Testimonial[] = testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      content: testimonial.content,
      photoUrl: testimonial.photoUrl,
      isFeatured: testimonial.isFeatured,
      sortOrder: testimonial.sortOrder,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}