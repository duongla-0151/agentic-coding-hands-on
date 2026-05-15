import { createAdminClient } from '@/lib/supabase/admin-client';
import { StatCard } from '@/components/admin/stat-card';

async function getStats() {
  const supabase = createAdminClient();

  const [
    { data: listData },
    { count: totalAdmins },
    { count: totalLogins },
    { data: recentLogs },
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1 }),
    supabase.from('user_roles').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('event_type', 'login'),
    supabase.from('audit_logs')
      .select('id, event_type, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    totalUsers: (listData as { total?: number } | null)?.total ?? 0,
    totalAdmins: totalAdmins ?? 0,
    totalLogins: totalLogins ?? 0,
    recentLogs: recentLogs ?? [],
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Super Admins" value={stats.totalAdmins} />
        <StatCard label="Total Logins" value={stats.totalLogins} sub="all time" />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {stats.recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white/70">{log.event_type}</span>
              <span className="text-white/30 text-xs">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
          {stats.recentLogs.length === 0 && (
            <p className="text-white/30 text-sm">No activity yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
