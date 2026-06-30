import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { Role } from "@prisma/client";
import { getEnv } from "@/config/env";

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  role: Role;
}

function getAccessSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().JWT_ACCESS_SECRET);
}

function getRefreshSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().JWT_REFRESH_SECRET);
}

function parseExpiry(expiry: string): string {
  return expiry;
}

export async function signAccessToken(payload: {
  userId: string;
  email: string;
  role: Role;
}): Promise<string> {
  const env = getEnv();
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(env.JWT_ACCESS_EXPIRES_IN))
    .sign(getAccessSecret());
}

export async function signRefreshToken(userId: string): Promise<string> {
  const env = getEnv();
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(env.JWT_REFRESH_EXPIRES_IN))
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify<AccessTokenPayload>(
    token,
    getAccessSecret(),
  );
  return payload;
}

export async function verifyRefreshToken(
  token: string,
): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret());
  return payload;
}
