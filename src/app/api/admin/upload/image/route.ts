import { NextResponse, type NextRequest } from "next/server";
import { processImage, validateImageFile } from "@/lib/media-utils";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Process image
    const processed = await processImage(file);

    return NextResponse.json({
      url: processed.path,
      thumbnail: processed.thumbnail,
      width: processed.width,
      height: processed.height,
      fileSize: processed.fileSize,
      mimeType: processed.mimeType,
      type: "IMAGE",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}