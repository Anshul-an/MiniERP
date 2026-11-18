import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  subtitle?: string;
  loading?: boolean;
}

const colorConfig = {
  blue:   { gradient: 'from-blue-500 to-cyan-500',    glow: 'rgba(59,130,246,0.25)',   bg: 'rgba(59,130,246,0.1)',  text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  green:  { gradient: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.25)',   bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.2)' },
  yellow: { gradient: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.25)',   bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  red:    { gradient: 'from-red-500 to-rose-500',     glow: 'rgba(239,68,68,0.25)',    bg: 'rgba(239,68,68,0.1)',  text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  purple: { gradient: 'from-violet-500 to-purple-500',glow: 'rgba(139,92,246,0.25)',   bg: 'rgba(139,92,246,0.1)', text: '#c084fc', border: 'rgba(139,92,246,0.2)' },
  indigo: { gradient: 'from-indigo-500 to-blue-600',  glow: 'rgba(99,102,241,0.25)',   bg: 'rgba(99,102,241,0.1)', text: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
};

export function StatCard({ title, value, icon, color = 'blue', subtitle, loading = false }: StatCardProps) {
  const cfg = colorConfig[color];

  if (loading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse"
        style={{ background: 'linear-gradient(135deg, #161b27, #1a2035)', border: '1px solid #252d3d' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl" style={{ background: '#252d3d' }} />
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded w-24" style={{ background: '#252d3d' }} />
            <div className="h-7 rounded w-16" style={{ background: '#1e2d45' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 group overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #161b27 0%, #1a2035 100%)',
        border: '1px solid #252d3d',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Subtle top glow strip */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.border}, transparent)` }} />

      <div className="flex items-center gap-4">
        {icon && (
          <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <div className="text-current" style={{ color: cfg.text }}>{icon}</div>
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: `inset 0 0 12px ${cfg.glow}` }} />
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748b' }}>{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{subtitle}</p>}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.text}, transparent)` }} />
    </div>
  );
}
