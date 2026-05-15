# Phase 9: Audit Logs Page

**Status:** planned | **Priority:** medium | **Effort:** small

## Overview

Paginated, filterable table of all audit log entries. Read-only. Filters: event type, date range.

## Implementation Steps

### app/[locale]/admin/audit-logs/page.tsx

```tsx
import { createAdminClient } from '@/lib/supabase/admin-client';

const PAGE_SIZE = 50;

const EVENT_TYPES = ['login', 'logout', 'oauth_callback'];

async function getLogs(page: number, eventType: string) {
  const supabase = createAdminClient();

  let query = supabase
    .from('audit_logs')
    .select('id, user_id, event_type, metadata, ip_address, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (eventType) query = query.eq('event_type', eventType);

  const { data, count } = await query;
  return { logs: data ?? [], total: count ?? 0 };
}

export default async function AuditLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; event?: string }>;
}) {
  const { page: pageStr, event = '' } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const { logs, total } = await getLogs(page, event);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          Audit Logs <span className="text-white/30 text-lg font-normal">({total})</span>
        </h1>
        <form className="flex gap-2">
          <select
            name="event"
            defaultValue={event}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          >
            <option value="">All events</option>
            {EVENT_TYPES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <button type="submit" className="px-3 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg">
            Filter
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              {['Event', 'User ID', 'IP', 'Metadata', 'Time'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-white/50 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    log.event_type === 'login'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : log.event_type === 'logout'
                      ? 'bg-white/5 text-white/40 border border-white/10'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {log.event_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/40 font-mono text-xs truncate max-w-[140px]">
                  {log.user_id ?? '—'}
                </td>
                <td className="px-4 py-3 text-white/40 text-xs">{log.ip_address ?? '—'}</td>
                <td className="px-4 py-3 text-white/30 text-xs truncate max-w-[160px]">
                  {log.metadata ? JSON.stringify(log.metadata) : '—'}
                </td>
                <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/30">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4 justify-end text-xs">
        {page > 1 && (
          <a href={`?page=${page - 1}&event=${event}`} className="text-white/50 hover:text-white px-3 py-1 rounded border border-white/10">← Prev</a>
        )}
        <span className="text-white/30 px-3 py-1">{page} / {totalPages || 1}</span>
        {page < totalPages && (
          <a href={`?page=${page + 1}&event=${event}`} className="text-white/50 hover:text-white px-3 py-1 rounded border border-white/10">Next →</a>
        )}
      </div>
    </div>
  );
}
```

## Files

- **Create:** `app/[locale]/admin/audit-logs/page.tsx`

## Success Criteria

- [ ] All audit log entries listed newest-first
- [ ] Event type filter works
- [ ] Pagination works with correct total count
- [ ] Empty state handled
