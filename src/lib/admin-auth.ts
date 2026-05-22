import crypto from "crypto";
import { cookies } from "next/headers";
import { ADMIN_SECRET } from "@/lib/admin-config";
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
  if (!ADMIN_SECRET) return false;

  const a = Buffer.from(password.trim());
  const b = Buffer.from(ADMIN_SECRET);
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
