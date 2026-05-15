'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem { label: string; href: string; icon: string; }

const NAV: NavItem[] = [
  { label: 'Overview',   href: '/admin',            icon: '⬜' },
  { label: 'Users',      href: '/admin/users',      icon: '👥' },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: '📋' },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-[#0B0F12] border-r border-white/10 flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-[#FFEA9E] font-bold text-sm uppercase tracking-widest">Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon }) => {
          const fullHref = `/${locale}${href}`;
          const active = pathname === fullHref || (href !== '/admin' && pathname.startsWith(fullHref));
          return (
            <Link
              key={href}
              href={fullHref}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left text-sm text-white/40 hover:text-white/70 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            ← Back to App
          </button>
        </form>
      </div>
    </aside>
  );
}
