import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSiteSettingsSchema } from "@/lib/validations/settings";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
    }

    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!settings) {
      return errorResponse("NOT_FOUND", "Settings not found", 404);
    }

    return jsonResponse({ success: true, data: settings }, 200);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch settings", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
    }

    const body = await request.json();
    
    // Validate input
    const validation = updateSiteSettingsSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid input",
        400,
        validation.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))
      );
    }

    // Get existing settings
    const existing = await prisma.siteSettings.findFirst();
    
    if (!existing) {
      return errorResponse("NOT_FOUND", "Settings not found", 404);
    }

    // Update settings
    const updated = await prisma.siteSettings.update({
      where: { id: existing.id },
      data: validation.data,
    });

    return jsonResponse({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to update settings", 500);
  }
}