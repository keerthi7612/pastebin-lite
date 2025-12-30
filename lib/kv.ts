import { kv } from "@vercel/kv";
import type { Paste } from "./types";

const TEST_MODE = process.env.TEST_MODE === "1";

// In-memory fallback for local development without Vercel KV
const inMemoryStore = new Map<string, Paste>();

export async function getPaste(id: string): Promise<Paste | null> {
  if (TEST_MODE || !process.env.KV_REST_API_URL) {
    return inMemoryStore.get(id) || null;
  }

  try {
    return await kv.get<Paste>(id);
  } catch (error) {
    console.error("KV get error:", error);
    return null;
  }
}

export async function setPaste(id: string, paste: Paste): Promise<void> {
  if (TEST_MODE || !process.env.KV_REST_API_URL) {
    inMemoryStore.set(id, paste);
    return;
  }

  try {
    await kv.set(id, paste);
  } catch (error) {
    console.error("KV set error:", error);
    throw new Error("Failed to store paste");
  }
}
