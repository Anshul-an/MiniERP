import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, ShoppingCart, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { StatusBadge } from '../components/StatusBadge';
import api from '../lib/api';
import type { DashboardData } from '../types';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e'];

function formatMonth(m: string) {
  const d = new Date(m + '-01');
  return d.toLocaleString('default', { month: 'short', year: '2-digit' });
}

function formatCurrency(n: number) {
  if (n >= 100000) return '?' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '?' + (n / 1000).toFixed(0) + 'K';
  return '?' + n;
}

export function Dashboard() {
  const { isAdmin, isManager, isEmployee, user } = useAuth();
  // set page title based on role
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
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
    fetchDashboard();
  }, [isAdmin, isManager]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Failed to load dashboard</div>;

  // ======== ADMIN DASHBOARD ========
  if (isAdmin) {
    const monthlyData = (data.monthlySpend || []).map(d => ({
      month: formatMonth(d.month),
      spend: d.total,
    }));

    const leaveData = (data.leaveStats || []).map(d => ({
      name: d.type,
      value: d.count,
    }));

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">System overview for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Employees" value={data.totalEmployees || 0} icon={<Users className="w-5 h-5" />} color="blue" />
          <StatCard title="Pending Leave Approvals" value={data.pendingLeaveApprovals || 0} icon={<CalendarDays className="w-5 h-5" />} color="yellow" />
          <StatCard title="Pending Purchase Approvals" value={data.pendingPurchaseApprovals || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
          <StatCard
            title="This Month Spend"
            value={formatCurrency((data.monthlySpend || []).slice(-1)[0]?.total || 0)}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Purchase Spend</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), 'Spend']} />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400">No spend data yet</div>
            )}
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Leave by Type</h2>
            {leaveData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {leaveData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400">No leave data</div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {(data.recentActivity || []).length === 0 && (
              <p className="text-gray-400 text-sm py-6 text-center">No recent activity</p>
            )}
            {(data.recentActivity || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {item.type === 'leave' ? (
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{item.description}</p>
                  <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-IN')}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ======== MANAGER DASHBOARD ========
  if (isManager) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{data.department} Department · {data.teamSize} team members</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Pending Leave Approvals" value={data.myTeamPendingLeaves || 0} icon={<CalendarDays className="w-5 h-5" />} color="yellow" />
          <StatCard title="Pending Purchase Approvals" value={data.pendingPurchaseApprovals || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
          <StatCard title="Team Size" value={data.teamSize || 0} icon={<Users className="w-5 h-5" />} color="blue" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/leave" className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors text-yellow-800 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Review {data.myTeamPendingLeaves || 0} pending leave requests
              </Link>
              <Link to="/purchase" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-800 text-sm font-medium">
                <ShoppingCart className="w-4 h-4" />
                Review {data.pendingPurchaseApprovals || 0} pending purchases
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Team Leaves This Month</h2>
            {(data.teamLeaveCalendar || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No approved leaves this month</div>
            ) : (
              <div className="space-y-2">
                {(data.teamLeaveCalendar || []).map((leave: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-sm">
                    <span className="font-medium text-gray-700">{leave.employee?.name}</span>
                    <span className="text-gray-500">{leave.daysCount} days · {leave.leaveType.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======== EMPLOYEE DASHBOARD ========
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.department} · {user?.role}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Pending Leave Requests" value={data.myPendingLeaveCount || 0} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatCard title="Pending Purchase Requests" value={data.myPendingPurchaseCount || 0} icon={<ShoppingCart className="w-5 h-5" />} color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Leave Balance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(data.leaveBalances || []).map((b: any) => (
            <LeaveBalanceCard key={b.id} balance={b} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/leave"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </Link>
          <Link
            to="/purchase"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Purchase Request
          </Link>
        </div>
      </div>
    </div>
  );
}

// dashboard charts should be responsive - wrap in ResponsiveContainer
// fix: show empty state when no data in charts
// add PageHeader with subtitle to Dashboard
// fix: recharts tooltip formatting for currency
// add usePageTitle to all pages
// fix: dashboard employee card shows correct remaining leave
