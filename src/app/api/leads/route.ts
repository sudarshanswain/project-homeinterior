import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSubmissionSchema } from "@/lib/validations/lead";
import { LeadStatus, LeadSource } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log incoming payload
    console.log("===== Incoming Payload =====");
    console.dir(body, { depth: null });
    
    // Validate the request body using safeParse to get detailed errors
    const parsed = leadSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.flatten());
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    
    const validatedData = parsed.data;

    // Generate lead number: INT-YYYY-NNNNNN
    const year = new Date().getFullYear();
    const lastLead = await prisma.lead.findFirst({
      orderBy: { createdAt: "desc" },
      select: { leadNumber: true },
    });

    let sequence = 1;
    if (lastLead && lastLead.leadNumber) {
      const lastNumber = parseInt(lastLead.leadNumber.split("-")[2]);
      sequence = lastNumber + 1;
    }
    const leadNumber = `INT-${year}-${String(sequence).padStart(6, "0")}`;

    // Create or update customer
    const customer = await prisma.customer.upsert({
      where: { email: validatedData.customer.email },
      update: {
        fullName: validatedData.customer.fullName,
        phone: validatedData.customer.phone,
        whatsapp: validatedData.customer.whatsapp,
        city: validatedData.customer.city,
        state: validatedData.customer.state,
        preferredTime: validatedData.customer.preferredTime,
      },
      create: {
        fullName: validatedData.customer.fullName,
        phone: validatedData.customer.phone,
        whatsapp: validatedData.customer.whatsapp,
        email: validatedData.customer.email,
        city: validatedData.customer.city,
        state: validatedData.customer.state,
        preferredTime: validatedData.customer.preferredTime,
      },
    });

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        customerId: customer.id,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        notes: validatedData.notes,
      },
      include: {
        customer: true,
      },
    });

    // Create property
    const property = await prisma.property.create({
      data: {
        customerId: customer.id,
        leadId: lead.id,
        propertyType: validatedData.property.propertyType,
        configuration: validatedData.property.configuration,
        totalArea: validatedData.property.totalArea,
        status: validatedData.property.status,
        expectedPossession: validatedData.property.expectedPossession || null,
      },
    });

    // Create rooms
    if (validatedData.rooms.rooms && validatedData.rooms.rooms.length > 0) {
      await prisma.room.createMany({
        data: validatedData.rooms.rooms.map((room, index) => ({
          propertyId: property.id,
          roomName: room.roomName,
          length: room.length || null,
          width: room.width || null,
          height: room.height || null,
          area: room.area || null,
          dimensionMode: room.dimensionMode || "LENGTH_WIDTH",
          wardrobeNeeded: room.wardrobeNeeded,
          falseCeiling: room.falseCeiling,
          lighting: room.lighting,
          painting: room.painting,
          flooring: room.flooring,
          tvUnit: room.tvUnit || false,
          wallpaper: room.wallpaper || false,
          lightingType: room.lightingType || "BASIC",
          flooringType: room.flooringType || "TILES",
          furnitureRequired: room.furnitureRequired || false,
          additionalNotes: room.additionalNotes || "",
          remarks: room.remarks || "",
          sortOrder: index,
        })),
      });
    }

    // Create requirements
    const budgetRange = validatedData.budget.budgetRange;
    const budgetValues = {
      UNDER_5_LAKHS: { min: 0, max: 500000 },
      "5_10_LAKHS": { min: 500000, max: 1000000 },
      "10_20_LAKHS": { min: 1000000, max: 2000000 },
      "20_40_LAKHS": { min: 2000000, max: 4000000 },
      "40_LAKHS_PLUS": { min: 4000000, max: null },
      CUSTOM: { min: validatedData.budget.budgetCustom, max: validatedData.budget.budgetCustom },
    };

    const budget = budgetValues[budgetRange as keyof typeof budgetValues] || { min: 0, max: null };

    await prisma.requirement.create({
      data: {
        leadId: lead.id,
        services: validatedData.services.services,
        designStyle: validatedData.design.designStyle,
        inspirationUrls: validatedData.design.inspirationUrls || [],
        budgetMin: budget.min,
        budgetMax: budget.max,
        budgetCustom: budgetRange === "CUSTOM" ? validatedData.budget.budgetCustom : null,
      },
    });

    // Create attachments
    if (validatedData.attachments.files && validatedData.attachments.files.length > 0) {
      await prisma.leadAttachment.createMany({
        data: validatedData.attachments.files.map((file, index) => ({
          leadId: lead.id,
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType || null,
          fileSize: file.fileSize || null,
          category: file.category,
          sortOrder: index,
        })),
      });
    }

    // Create status history
    await prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        toStatus: LeadStatus.NEW,
        notes: "Lead created from website estimation form",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      data: {
        leadId: lead.id,
        leadNumber: lead.leadNumber,
      },
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}