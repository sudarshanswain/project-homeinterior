import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LeadStatus, LeadSource } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { customer: { fullName: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search } } },
        { leadNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status as LeadStatus;
    }

    if (source) {
      where.source = source as LeadSource;
    }

    // Get total count
    const totalCount = await prisma.lead.count({ where });

    // Get leads with pagination
    const leads = await prisma.lead.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            city: true,
            state: true,
          },
        },
        property: {
          select: {
            id: true,
            propertyType: true,
            totalArea: true,
            configuration: true,
          },
        },
        requirements: {
          select: {
            id: true,
            services: true,
            designStyle: true,
            budgetMin: true,
            budgetMax: true,
          },
        },
        _count: {
          select: {
            LeadAttachment: true,
            VendorAssignment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}