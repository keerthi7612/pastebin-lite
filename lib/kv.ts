import { kv } from "@vercel/kv";
import type { Paste } from "./types";

const TEST_MODE = process.env.TEST_MODE === "1";
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const USE_KV = !!(KV_URL && KV_TOKEN);

// In-memory fallback for local development without Vercel KV
const inMemoryStore = new Map<string, Paste>();

console.log("🔧 KV Storage Config:", {
  TEST_MODE,
  USE_KV,
  KV_URL: KV_URL ? "✅ SET" : "❌ MISSING",
  KV_TOKEN: KV_TOKEN ? "✅ SET" : "❌ MISSING",
  ENV_KEYS: Object.keys(process.env)
    .filter((k) => k.includes("KV"))
    .join(", "),
});

export async function getPaste(id: string): Promise<Paste | null> {
  console.log(`📖 getPaste() called with id: ${id}, USE_KV: ${USE_KV}`);
  if (TEST_MODE || !USE_KV) {
    const result = inMemoryStore.get(id) || null;
    console.log(`   In-memory lookup: ${result ? "✅ Found" : "❌ Not found"}`);
    return result;
  }

  try {
    console.log(`   Querying Vercel KV...`);
    const result = await kv.get<Paste>(id);
    console.log(
      `   KV result: ${result ? "✅ Found" : "❌ Not found"}`,
      result
    );
    return result;
  } catch (error) {
    console.error(`   ❌ KV get error:`, error);
    return null;
  }
}

export async function setPaste(id: string, paste: Paste): Promise<void> {
  console.log(`💾 setPaste() called with id: ${id}, USE_KV: ${USE_KV}`);
  console.log(`   Paste data:`, paste);

  if (TEST_MODE || !USE_KV) {
    inMemoryStore.set(id, paste);
    console.log(`   ✅ Saved to in-memory store`);
    return;
  }

  try {
    console.log(`   Saving to Vercel KV...`);
    await kv.set(id, paste);
    console.log(`   ✅ Saved to Vercel KV`);
  } catch (error) {
    console.error(`   ❌ KV set error:`, error);
    throw new Error("Failed to store paste");
  }
}
