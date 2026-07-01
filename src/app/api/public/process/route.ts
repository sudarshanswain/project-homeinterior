import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProcessStep } from "@/types/public-api";

export async function GET() {
  try {
    const steps = await prisma.processStep.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const data: ProcessStep[] = steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      icon: step.icon,
      stepNumber: step.stepNumber,
      sortOrder: step.sortOrder,
      isActive: step.isActive,
      createdAt: step.createdAt.toISOString(),
      updatedAt: step.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching process steps:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch process steps" },
      { status: 500 }
    );
  }
}