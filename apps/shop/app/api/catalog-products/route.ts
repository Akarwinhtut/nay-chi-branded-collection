import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminSessionCookieName,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import {
  CatalogConflictError,
  catalogProductInputSchema,
  createCatalogProduct,
  getAdminCatalogProducts,
} from "@/lib/catalog";

async function isAuthorized() {
  const cookieStore = await cookies();

  return isAdminSessionValid(cookieStore.get(adminSessionCookieName)?.value);
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthorized())) {
    return unauthorizedResponse();
  }

  try {
    const result = await getAdminCatalogProducts();

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The catalog could not be loaded.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const input = catalogProductInputSchema.parse(body);
    const product = await createCatalogProduct(input);

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Please review the product fields.",
        },
        { status: 400 },
      );
    }

    if (error instanceof CatalogConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    const message =
      error instanceof Error ? error.message : "The bag could not be saved right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
