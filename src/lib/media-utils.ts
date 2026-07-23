import sharp from "sharp";
import { writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const PORTFOLIO_DIR = join(UPLOAD_DIR, "portfolio");
const THUMBNAIL_DIR = join(UPLOAD_DIR, "thumbnails");

// Ensure directories exist
mkdirSync(PORTFOLIO_DIR, { recursive: true });
mkdirSync(THUMBNAIL_DIR, { recursive: true });

export interface ProcessedImage {
  filename: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
}

export interface UploadValidation {
  valid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): UploadValidation => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }

  return { valid: true };
};

export const validateVideoFile = (file: File): UploadValidation => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];

  if (file.size > maxSize) {
    return { valid: false, error: "Video size must be less than 50MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only MP4, WebM, and OGG videos are allowed" };
  }

  return { valid: true };
};

export const generateThumbnail = async (
  imagePath: string,
  thumbnailPath: string
): Promise<{ width: number; height: number }> => {
  const metadata = await sharp(imagePath).metadata();

  await sharp(imagePath)
    .resize(400, 300, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(thumbnailPath);

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
};

export const processImage = async (file: File): Promise<ProcessedImage> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

  const filePath = join(PORTFOLIO_DIR, filename);
  const thumbnailFilename = `thumb-${filename.split(".")[0]}.webp`;
  const thumbnailPath = join(THUMBNAIL_DIR, thumbnailFilename);

  // Save original file
  writeFileSync(filePath, buffer);

  // Generate thumbnail
  const { width, height } = await generateThumbnail(filePath, thumbnailPath);

  // Convert to WebP for optimization
  const webpPath = join(PORTFOLIO_DIR, `${filename.split(".")[0]}.webp`);
  await sharp(filePath)
    .webp({ quality: 85 })
    .toFile(webpPath);

  // Remove original file
  unlinkSync(filePath);

  return {
    filename: `${filename.split(".")[0]}.webp`,
    path: `/uploads/portfolio/${filename.split(".")[0]}.webp`,
    thumbnail: `/uploads/thumbnails/${thumbnailFilename}`,
    width,
    height,
    fileSize: file.size,
    mimeType: "image/webp",
  };
};

export const deleteImage = (path: string, thumbnail: string): void => {
  try {
    const fullPath = join(process.cwd(), "public", path);
    const fullThumbnail = join(process.cwd(), "public", thumbnail);

    if (path && fullPath !== join(process.cwd(), "public")) {
      unlinkSync(fullPath);
    }
    if (thumbnail && fullThumbnail !== join(process.cwd(), "public")) {
      unlinkSync(fullThumbnail);
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export const extractVimeoId = (url: string): string | null => {
  const pattern = /vimeo\.com\/(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const getVimeoThumbnail = async (videoId: string): Promise<string> => {
  try {
    const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
    const data = await response.json();
    return data[0]?.thumbnail_large || "";
  } catch {
    return "";
  }
};