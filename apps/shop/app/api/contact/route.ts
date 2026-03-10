import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  leadInquirySchema,
  mapLeadInquiryToInsert,
} from "@/lib/contact";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inquiry = leadInquirySchema.parse(body);
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("lead_inquiries")
      .insert(mapLeadInquiryToInsert(inquiry));

    if (error) {
      return NextResponse.json(
        {
          error:
            "The inquiry could not be stored right now. Please use Telegram or email while the form is unavailable.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message:
        "Thanks. Your project inquiry has been stored and is ready for follow-up.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Please review the form fields.",
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "The inquiry could not be sent right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
