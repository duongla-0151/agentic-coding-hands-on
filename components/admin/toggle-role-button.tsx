'use client';
import { useTransition } from 'react';
import { toggleSuperAdmin } from '@/app/actions/admin-role-actions';

export function ToggleRoleButton({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleSuperAdmin(userId, !isAdmin))}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        isAdmin
          ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
          : 'bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20 hover:bg-[#FFEA9E]/20'
      }`}
    >
      {isPending ? 'Saving…' : isAdmin ? 'Revoke super_admin' : 'Grant super_admin'}
    </button>
  );
}
