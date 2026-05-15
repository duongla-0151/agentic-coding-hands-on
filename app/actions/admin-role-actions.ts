'use server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { requireAdmin } from '@/lib/admin/check-admin';

export async function toggleSuperAdmin(targetUserId: string, grant: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();

  if (grant) {
    await supabase.from('user_roles').upsert({ user_id: targetUserId, role: 'super_admin' });
  } else {
    await supabase.from('user_roles').delete()
      .eq('user_id', targetUserId)
      .eq('role', 'super_admin');
  }

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${targetUserId}`);
}
