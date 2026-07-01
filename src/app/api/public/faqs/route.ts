import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Faq } from "@/types/public-api";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });

    const data: Faq[] = faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sortOrder: faq.sortOrder,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}