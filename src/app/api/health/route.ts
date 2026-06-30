import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api-response";
import { jsonResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const DB_TIMEOUT_MS = 5_000;

async function checkDatabase(): Promise<void> {
  await Promise.race([
    prisma.$queryRaw`SELECT 1`,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Database connection timeout")), DB_TIMEOUT_MS);
    }),
  ]);
}

export async function GET() {
  const startedAt = Date.now();

  try {
    await checkDatabase();

    const uptime = process.uptime();
    const responseTimeMs = Date.now() - startedAt;

    return jsonResponse(
      apiSuccess({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        database: "connected",
        responseTimeMs,
        version: process.env.npm_package_version ?? "0.1.0",
      }),
    );
  } catch (error) {
    logger.error({ error }, "Health check failed");

    return jsonResponse(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Health check failed",
        },
      },
      503,
    );
  }
}
