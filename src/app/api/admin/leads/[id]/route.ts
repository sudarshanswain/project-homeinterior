import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true,
        property: {
          include: {
            rooms: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
        requirements: true,
        attachments: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        vendorAssignments: {
          include: {
            quotations: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
        notesList: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, estimatedValue, priority, followUpDate } = body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(estimatedValue !== undefined && { estimatedValue }),
        ...(priority !== undefined && { priority }),
        ...(followUpDate !== undefined && { followUpDate: followUpDate ? new Date(followUpDate) : null }),
      },
      include: {
        customer: true,
      },
    });

    // Create status history entry if status changed
    if (status) {
      await prisma.leadStatusHistory.create({
        data: {
          leadId: id,
          toStatus: status,
          notes: notes || "Status updated",
        },
      });
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}