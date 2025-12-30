import { nanoid } from "nanoid";
import type {
  Paste,
  CreatePasteRequest,
  CreatePasteResponse,
  GetPasteResponse,
} from "./types";
import { getPaste, setPaste } from "./kv";

export function generatePasteId(): string {
  return nanoid(10);
}

export async function createPaste(
  request: CreatePasteRequest,
  baseUrl: string
): Promise<CreatePasteResponse> {
  const id = generatePasteId();

  const paste: Paste = {
    content: request.content,
    max_views: request.max_views,
    remaining_views: request.max_views,
  };

  await setPaste(id, paste);

  return {
    id,
    url: `${baseUrl}/p/${id}`,
  };
}

export async function fetchPaste(id: string): Promise<GetPasteResponse | null> {
  const paste = await getPaste(id);

  if (!paste) {
    return null;
  }

  // Check if view limit has been reached (don't decrement here, just return)
  if (paste.max_views !== undefined && paste.remaining_views !== undefined) {
    if (paste.remaining_views <= 0) {
      return null;
    }
  }

  return {
    content: paste.content,
    remaining_views: paste.remaining_views ?? null,
  };
}

export async function consumeView(id: string): Promise<boolean> {
  const paste = await getPaste(id);

  if (!paste) {
    return false;
  }

  // Check if view limit has been reached
  if (paste.max_views !== undefined && paste.remaining_views !== undefined) {
    if (paste.remaining_views <= 0) {
      return false;
    }

    // Decrement remaining views
    paste.remaining_views--;
    await setPaste(id, paste);
  }

  return true;
}

export function validateCreatePasteRequest(body: any): {
  valid: boolean;
  error?: string;
} {
  if (!body) {
    return { valid: false, error: "Request body is required" };
  }

  if (typeof body.content !== "string" || body.content.trim() === "") {
    return {
      valid: false,
      error: "content is required and must be a non-empty string",
    };
  }

  if (body.max_views !== undefined) {
    if (!Number.isInteger(body.max_views) || body.max_views < 1) {
      return { valid: false, error: "max_views must be an integer >= 1" };
    }
  }

  return { valid: true };
}
