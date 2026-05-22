import crypto from "crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createSessionToken as createSessionTokenAsync,
  verifySessionToken as verifySessionTokenAsync,
} from "@/lib/admin-session";

export {
  ADMIN_COOKIE,
  isAdminConfigured,
  sessionCookieOptions,
} from "@/lib/admin-session";

export function verifyAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export async function createSessionToken(): Promise<string> {
  return createSessionTokenAsync();
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return verifySessionTokenAsync(token);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionTokenAsync(cookieStore.get(ADMIN_COOKIE)?.value);
}
