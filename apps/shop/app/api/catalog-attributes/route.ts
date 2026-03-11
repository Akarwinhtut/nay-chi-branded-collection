import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminSessionCookieName,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import {
  catalogAttributeUpdateSchema,
  renameCatalogAttributeValues,
} from "@/lib/catalog";

async function isAuthorized() {
  const cookieStore = await cookies();

  return isAdminSessionValid(cookieStore.get(adminSessionCookieName)?.value);
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const input = catalogAttributeUpdateSchema.parse(body);
    const result = await renameCatalogAttributeValues(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Please review the attribute fields.",
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "The catalog labels could not be updated right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
