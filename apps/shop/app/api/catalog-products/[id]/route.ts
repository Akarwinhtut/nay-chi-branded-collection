import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminSessionCookieName,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import {
  CatalogConflictError,
  CatalogNotFoundError,
  catalogProductInputSchema,
  deleteCatalogProduct,
  updateCatalogProduct,
} from "@/lib/catalog";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function isAuthorized() {
  const cookieStore = await cookies();

  return isAdminSessionValid(cookieStore.get(adminSessionCookieName)?.value);
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAuthorized())) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const input = catalogProductInputSchema.parse(body);
    const product = await updateCatalogProduct(id, input);

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

    if (error instanceof CatalogNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    const message =
      error instanceof Error ? error.message : "The bag could not be updated right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthorized())) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    await deleteCatalogProduct(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof CatalogNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    const message =
      error instanceof Error ? error.message : "The bag could not be deleted right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
