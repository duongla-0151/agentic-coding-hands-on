export function RoleBadge({ isAdmin }: { isAdmin: boolean }) {
  return isAdmin ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20">
      super_admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-white/40 border border-white/10">
      user
    </span>
  );
}
