import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { RoleBadge } from '@/components/admin/role-badge';
import { ToggleRoleButton } from '@/components/admin/toggle-role-button';

async function getUser(userId: string) {
  const supabase = createAdminClient();

  const [
    { data: { user }, error },
    { data: roles },
    { data: logs },
  ] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from('user_roles').select('role').eq('user_id', userId),
    supabase.from('audit_logs')
      .select('id, event_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at ?? null,
    is_admin: (roles ?? []).some((r) => r.role === 'super_admin'),
    recent_logs: logs ?? [],
  };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;
  const user = await getUser(userId);

  if (!user) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <a href={`/${locale}/admin/users`} className="text-white/40 hover:text-white text-sm">← Users</a>
        <h1 className="text-2xl font-bold text-white">{user.email}</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6 space-y-4">
        <Row label="Email" value={user.email} />
        <Row label="Role" value={<RoleBadge isAdmin={user.is_admin} />} />
        <Row label="Joined" value={new Date(user.created_at).toLocaleString()} />
        <Row
          label="Last Sign In"
          value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—'}
        />
      </div>

      <div className="mb-6">
        <ToggleRoleButton userId={userId} isAdmin={user.is_admin} />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {user.recent_logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white/70">{log.event_type}</span>
              <span className="text-white/30 text-xs">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
          {user.recent_logs.length === 0 && (
            <p className="text-white/30 text-sm">No activity.</p>
          )}
        </div>
      </section>
    </div>
  );
}
