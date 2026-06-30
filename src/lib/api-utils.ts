import { NextResponse } from "next/server";
import { apiError, type ApiResponse } from "@/lib/api-response";

export function jsonResponse<T>(
  body: ApiResponse<T>,
  status = 200,
): NextResponse {
  return NextResponse.json(body, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown[],
): NextResponse {
  return jsonResponse(apiError(code, message, details), status);
}
