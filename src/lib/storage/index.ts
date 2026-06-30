import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getPublicUrl(storedPath: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly uploadDir: string) {}

  private resolvePath(storedPath: string): string {
    return path.join(this.uploadDir, storedPath);
  }

  async upload(file: Buffer, filename: string): Promise<string> {
    const ext = path.extname(filename);
    const storedName = `${crypto.randomUUID()}${ext}`;
    const storedPath = path.join("files", storedName);
    const fullPath = this.resolvePath(storedPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file);

    return storedPath;
  }

  async delete(storedPath: string): Promise<void> {
    const fullPath = this.resolvePath(storedPath);
    await fs.unlink(fullPath).catch(() => undefined);
  }

  getPublicUrl(storedPath: string): string {
    return `/uploads/${storedPath.replace(/\\/g, "/")}`;
  }
}

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (storageInstance) return storageInstance;

  const driver = process.env.STORAGE_DRIVER ?? "local";
  const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

  if (driver === "s3") {
    throw new Error("S3 storage provider is not configured yet");
  }

  storageInstance = new LocalStorageProvider(uploadDir);
  return storageInstance;
}
