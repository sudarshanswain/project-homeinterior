import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Stat } from "@/types/public-api";

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const data: Stat[] = stats.map((stat) => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      sortOrder: stat.sortOrder,
      isActive: stat.isActive,
      createdAt: stat.createdAt.toISOString(),
      updatedAt: stat.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}