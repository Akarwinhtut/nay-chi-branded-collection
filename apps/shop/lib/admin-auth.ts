import { createHmac, timingSafeEqual } from "node:crypto";

export const adminSessionCookieName = "naychi_admin_session";
const adminSessionDurationSeconds = 60 * 60 * 24 * 14;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminSession(payload: string) {
  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret) {
    throw new Error(
      "Admin authentication is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.",
    );
  }

  return createHmac("sha256", sessionSecret).update(payload).digest("hex");
}

export function hasAdminAuthConfig() {
  return Boolean(getAdminPassword() && getAdminSessionSecret());
}

export function isAdminPasswordValid(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

export function createAdminSessionToken() {
  const expiresAt = String(Date.now() + adminSessionDurationSeconds * 1000);
  const signature = signAdminSession(expiresAt);

  return `${expiresAt}.${signature}`;
}

export function isAdminSessionValid(token?: string | null) {
  if (!token) {
    return false;
  }

  const [expiresAt, signature, ...rest] = token.split(".");

  if (!expiresAt || !signature || rest.length > 0) {
    return false;
  }

  const expiresAtNumber = Number(expiresAt);

  if (!Number.isFinite(expiresAtNumber) || expiresAtNumber < Date.now()) {
    return false;
  }

  try {
    return safeEqual(signature, signAdminSession(expiresAt));
  } catch {
    return false;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionDurationSeconds,
  };
}

export function sanitizeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  if (value === "/admin/login") {
    return "/admin";
  }

  return value;
}
