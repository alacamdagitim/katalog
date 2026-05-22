/** Build-time secret for admin session signing (also used on Vercel Edge middleware). */
export const ADMIN_SECRET = (
  process.env.ADMIN_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "sapanca"
).trim();
