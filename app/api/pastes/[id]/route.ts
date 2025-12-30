import { NextRequest, NextResponse } from "next/server";
import { fetchPaste, consumeView } from "@/lib/pasteUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const paste = await fetchPaste(id);

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found or expired" },
        { status: 404 }
      );
    }

    // Consume one view
    await consumeView(id);

    return NextResponse.json(paste);
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
