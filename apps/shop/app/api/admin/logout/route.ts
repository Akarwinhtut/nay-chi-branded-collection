import { NextResponse } from "next/server";

import {
  adminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login?logout=1", request.url), {
    status: 303,
  });

  response.cookies.set(adminSessionCookieName, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
