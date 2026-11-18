interface StatusBadgeProps { status: string; }

const statusStyles: Record<string, { bg: string; color: string; border: string; dot?: string }> = {
  PENDING:         { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)',  dot: '#fbbf24' },
  APPROVED:        { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)', dot: '#34d399' },
  REJECTED:        { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)',  dot: '#f87171' },
  PENDING_MANAGER: { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)', dot: '#60a5fa' },
  PENDING_ADMIN:   { bg: 'rgba(139,92,246,0.1)',  color: '#c084fc', border: 'rgba(139,92,246,0.25)', dot: '#c084fc' },
  ORDERED:         { bg: 'rgba(99,102,241,0.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.25)', dot: '#a5b4fc' },
  RECEIVED:        { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: 'rgba(16,185,129,0.3)',  dot: '#6ee7b7' },
  DRAFT:           { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
};

const statusLabels: Record<string, string> = {
  PENDING_MANAGER: 'Mgr. Review',
  PENDING_ADMIN: 'Admin Review',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusStyles[status] || { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' };
  const label = statusLabels[status] || (status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' '));

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.dot && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: s.dot }} />
      )}
      {label}
    </span>
  );
}
