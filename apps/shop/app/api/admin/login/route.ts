import { NextResponse } from "next/server";

import {
  adminSessionCookieName,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  hasAdminAuthConfig,
  isAdminPasswordValid,
  sanitizeNextPath,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/admin"));
  const loginUrl = new URL("/admin/login", request.url);

  loginUrl.searchParams.set("next", nextPath);

  if (!hasAdminAuthConfig()) {
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  if (!isAdminPasswordValid(password)) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  });

  response.cookies.set(
    adminSessionCookieName,
    createAdminSessionToken(),
    getAdminSessionCookieOptions(),
  );

  return response;
}
