import { NextRequest, NextResponse } from "next/server";
import { fetchPaste, consumeView } from "@/lib/pasteUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Paste ID is required" },
        { status: 400 }
      );
    }

    const paste = await fetchPaste(id);

    if (!paste) {
      console.warn(`Paste not found or expired: ${id}`);
      return NextResponse.json(
        { error: "Paste not found or expired" },
        { status: 404 }
      );
    }

    // Consume one view
    const consumed = await consumeView(id);
    if (!consumed) {
      console.warn(`Failed to consume view for paste: ${id}`);
    }

    return NextResponse.json(paste);
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
