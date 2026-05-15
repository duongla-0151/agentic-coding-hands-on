import { createClient } from '@/lib/supabase/server';

// Throws 'UNAUTHENTICATED' or 'FORBIDDEN' — callers redirect accordingly
export async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('UNAUTHENTICATED');

  const { data } = await supabase.rpc('is_super_admin');
  if (!data) throw new Error('FORBIDDEN');

  return user.id;
}
