import { NextRequest, NextResponse } from "next/server";
import { createPaste, validateCreatePasteRequest } from "@/lib/pasteUtils";
import type { CreatePasteRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreatePasteRequest = await request.json();

    const validation = validateCreatePasteRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const response = await createPaste(body, baseUrl);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
