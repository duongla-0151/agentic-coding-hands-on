import { createAdminClient } from '@/lib/supabase/admin-client';
import { headers } from 'next/headers';

type AuditEvent = 'login' | 'logout' | 'oauth_callback';

interface AuditEntry {
  userId: string | null;
  eventType: AuditEvent;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog({ userId, eventType, metadata }: AuditEntry) {
  try {
    const supabase = createAdminClient();
    const headerStore = await headers();

    await supabase.from('audit_logs').insert({
      user_id: userId,
      event_type: eventType,
      metadata: metadata ?? null,
      ip_address: headerStore.get('x-forwarded-for') ?? headerStore.get('x-real-ip'),
      user_agent: headerStore.get('user-agent'),
    });
  } catch {
    // Audit log failure must not break auth flow
  }
}
