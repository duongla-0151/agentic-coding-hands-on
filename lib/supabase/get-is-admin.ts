import { createClient } from "./server";

/** Checks if the authenticated user is a super admin via RPC. Degrades gracefully if unavailable. */
export async function getIsAdmin(userId: string): Promise<boolean> {
  // userId reserved for future direct lookup if RPC unavailable
  void userId;
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("is_super_admin");
    return data === true;
  } catch {
    return false;
  }
}
