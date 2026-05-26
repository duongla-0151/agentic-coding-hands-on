import { createAdminClient } from "@/lib/supabase/admin-client";
import type { UserInfo } from "./types";

// 30-second in-process cache — avoids repeated listUsers calls per request batch
let cache: Map<string, UserInfo> | null = null;
let cacheTs = 0;
const CACHE_TTL_MS = 30_000;

export async function fetchUserMap(): Promise<Map<string, UserInfo>> {
  if (cache && Date.now() - cacheTs < CACHE_TTL_MS) return cache;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error || !data) return cache ?? new Map();

  const map = new Map<string, UserInfo>();
  for (const u of data.users) {
    // email intentionally excluded — not needed in public API responses
    map.set(u.id, {
      id: u.id,
      name: u.user_metadata?.full_name ?? u.email ?? u.id,
      avatar: u.user_metadata?.avatar_url ?? null,
    });
  }
  cache = map;
  cacheTs = Date.now();
  return map;
}

export function starCount(kudosReceived: number): number {
  if (kudosReceived >= 50) return 3;
  if (kudosReceived >= 20) return 2;
  if (kudosReceived >= 10) return 1;
  return 0;
}
