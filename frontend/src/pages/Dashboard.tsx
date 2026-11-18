import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, ShoppingCart, TrendingUp,
  Clock, Plus, ArrowRight, Activity
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/StatCard';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { StatusBadge } from '../components/StatusBadge';
import { Skeleton } from '../components/LoadingSpinner';
import api from '../lib/api';
import type { DashboardData } from '../types';

const CHART_COLORS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];

const DARK_TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1a2035',
    border: '1px solid #252d3d',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: 13,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#94a3b8', fontWeight: 600 },
  cursor: { fill: 'rgba(99,102,241,0.08)' },
};

const CHART_AXIS_STYLE = { fill: '#475569', fontSize: 11 };
const GRID_STYLE = { stroke: '#1e2d45', strokeDasharray: '4 4' };

function formatMonth(m: string) {
  const d = new Date(m + '-01');
  return d.toLocaleString('default', { month: 'short', year: '2-digit' });
}
function formatCurrency(n: number) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
  return '₹' + n;
}

// Dark card wrapper
function DarkCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #161b27 0%, #1a2035 100%)',
        border: '1px solid #252d3d',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
      style={{ color: '#94a3b8' }}>
      <span className="w-1 h-4 rounded-full inline-block"
        style={{ background: 'linear-gradient(180deg,#6366f1,#8b5cf6)' }} />
      {children}
    </h2>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton height="h-7" width="w-48" />
        <Skeleton height="h-4" width="w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <StatCard key={i} title="" value="" loading />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl p-6" style={{ background: '#161b27', border: '1px solid #252d3d' }}>
          <Skeleton height="h-5" width="w-40" className="mb-4" />
          <Skeleton height="h-56" />
        </div>
        <div className="rounded-2xl p-6" style={{ background: '#161b27', border: '1px solid #252d3d' }}>
          <Skeleton height="h-5" width="w-32" className="mb-4" />
          <Skeleton height="h-56" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { isAdmin, isManager, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        let endpoint = '/dashboard/employee';
        if (isAdmin) endpoint = '/dashboard/admin';
        else if (isManager) endpoint = '/dashboard/manager';
        const res = await api.get<DashboardData>(endpoint);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAdmin, isManager]);

  if (loading) return <DashboardSkeleton />;
  if (!data) return (
    <div className="text-center py-20" style={{ color: '#64748b' }}>
      Failed to load dashboard data. Try refreshing.
    </div>
  );

  /* ───── ADMIN ───── */
  if (isAdmin) {
    const monthlyData = (data.monthlySpend || []).map(d => ({
      month: formatMonth(d.month), spend: d.total,
    }));
    const leaveData = (data.leaveStats || []).map(d => ({
      name: d.type, value: d.count,
    }));

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: '#34d399' }}>All Systems Online</span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Employees" value={data.totalEmployees || 0} icon={<Users className="w-5 h-5" />} color="blue" />
          <StatCard title="Pending Leaves" value={data.pendingLeaveApprovals || 0} icon={<CalendarDays className="w-5 h-5" />} color="yellow" />
          <StatCard title="Pending Purchases" value={data.pendingPurchaseApprovals || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
          <StatCard
            title="This Month Spend"
            value={formatCurrency((data.monthlySpend || []).slice(-1)[0]?.total || 0)}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <DarkCard className="xl:col-span-2">
            <CardTitle>Monthly Purchase Spend</CardTitle>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis dataKey="month" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART_AXIS_STYLE} tickFormatter={v => formatCurrency(Number(v))} axisLine={false} tickLine={false} />
                  <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v: any) => [formatCurrency(Number(v) || 0), 'Spend']} />
                  <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} fill="url(#spendGrad)" dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 5, fill: '#818cf8' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-sm" style={{ color: '#475569' }}>No spend data yet</div>
            )}
          </DarkCard>

          <DarkCard>
            <CardTitle>Leave by Type</CardTitle>
            {leaveData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={76} innerRadius={40} paddingAngle={3}>
                    {leaveData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  <Tooltip {...DARK_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-sm" style={{ color: '#475569' }}>No leave data</div>
            )}
          </DarkCard>
        </div>

        {/* Recent Activity */}
        <DarkCard>
          <div className="flex items-center justify-between mb-5">
            <CardTitle>Recent Activity</CardTitle>
            <div className="flex items-center gap-1.5" style={{ color: '#475569' }}>
              <Activity className="w-3.5 h-3.5" />
              <span className="text-xs">Live</span>
            </div>
          </div>
          <div className="space-y-1">
            {(data.recentActivity || []).length === 0 && (
              <p className="text-sm py-8 text-center" style={{ color: '#475569' }}>No recent activity</p>
            )}
            {(data.recentActivity || []).map((item, i) => (
              <div key={i}
                className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                style={{ borderBottom: i < (data.recentActivity?.length || 0) - 1 ? '1px solid #1e2d45' : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: item.type === 'leave' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                    border: item.type === 'leave' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(139,92,246,0.2)',
                  }}>
                  {item.type === 'leave'
                    ? <CalendarDays className="w-4 h-4" style={{ color: '#60a5fa' }} />
                    : <ShoppingCart className="w-4 h-4" style={{ color: '#c084fc' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.description}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{new Date(item.date).toLocaleDateString('en-IN')}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </DarkCard>
      </div>
    );
  }

  /* ───── MANAGER ───── */
  if (isManager) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manager Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {data.department} Department &bull; {data.teamSize} team members
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Pending Leaves" value={data.myTeamPendingLeaves || 0} icon={<CalendarDays className="w-5 h-5" />} color="yellow" />
          <StatCard title="Pending Purchases" value={data.pendingPurchaseApprovals || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
          <StatCard title="Team Size" value={data.teamSize || 0} icon={<Users className="w-5 h-5" />} color="blue" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DarkCard>
            <CardTitle>Quick Actions</CardTitle>
            <div className="space-y-3">
              <Link to="/leave"
                className="flex items-center gap-3 p-4 rounded-xl transition-all group hover:-translate-y-0.5"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <Clock className="w-4 h-4" style={{ color: '#fbbf24' }} />
                </div>
                <span className="text-sm font-medium flex-1" style={{ color: '#fbbf24' }}>
                  Review {data.myTeamPendingLeaves || 0} pending leave requests
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#fbbf24' }} />
              </Link>
              <Link to="/purchase"
                className="flex items-center gap-3 p-4 rounded-xl transition-all group hover:-translate-y-0.5"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <ShoppingCart className="w-4 h-4" style={{ color: '#c084fc' }} />
                </div>
                <span className="text-sm font-medium flex-1" style={{ color: '#c084fc' }}>
                  Review {data.pendingPurchaseApprovals || 0} pending purchases
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#c084fc' }} />
              </Link>
            </div>
          </DarkCard>

          <DarkCard>
            <CardTitle>Team Leaves This Month</CardTitle>
            {(data.teamLeaveCalendar || []).length === 0 ? (
              <div className="text-center py-10 text-sm" style={{ color: '#475569' }}>No approved leaves this month</div>
            ) : (
              <div className="space-y-2">
                {(data.teamLeaveCalendar || []).map((leave: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(30,45,69,0.5)', border: '1px solid #252d3d' }}>
                    <span className="text-sm font-medium text-white">{leave.employee?.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                      {leave.daysCount}d &bull; {leave.leaveType.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DarkCard>
        </div>
      </div>
    );
  }

  /* ───── EMPLOYEE ───── */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {user?.department} &bull; {user?.role}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Pending Leave Requests" value={data.myPendingLeaveCount || 0} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatCard title="Pending Purchase Requests" value={data.myPendingPurchaseCount || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
      </div>

      <DarkCard>
        <CardTitle>Leave Balance</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(data.leaveBalances || []).map((b: any) => (
            <LeaveBalanceCard key={b.id} balance={b} />
          ))}
        </div>
      </DarkCard>

      <DarkCard>
        <CardTitle>Quick Actions</CardTitle>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/leave"
            className="flex items-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold rounded-xl transition-all active:scale-95 hover:-translate-y-0.5 text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </Link>
          <Link
            to="/purchase"
            className="flex items-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold rounded-xl transition-all active:scale-95 hover:-translate-y-0.5"
            style={{
              background: 'rgba(30,45,69,0.6)',
              border: '1px solid #252d3d',
              color: '#94a3b8',
            }}
          >
            <Plus className="w-4 h-4" />
            New Purchase Request
          </Link>
        </div>
      </DarkCard>
    </div>
  );
}
