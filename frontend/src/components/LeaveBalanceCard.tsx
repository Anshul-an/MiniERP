import type { LeaveBalance, LeaveType } from '../types';
import { cn } from '../lib/utils';

const leaveColors: Record<LeaveType, { bg: string; bar: string; label: string }> = {
  SICK: { bg: 'bg-red-50 border-red-100', bar: 'bg-red-500', label: 'Sick Leave' },
  CASUAL: { bg: 'bg-blue-50 border-blue-100', bar: 'bg-blue-500', label: 'Casual Leave' },
  ANNUAL: { bg: 'bg-green-50 border-green-100', bar: 'bg-green-500', label: 'Annual Leave' },
};

export function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const config = leaveColors[balance.leaveType] || { bg: 'bg-gray-50 border-gray-100', bar: 'bg-gray-500', label: balance.leaveType };
  const remaining = Math.max(0, balance.totalDays - balance.usedDays);
  const total = Math.max(1, balance.totalDays);
  const pct = Math.min(100, Math.round((balance.usedDays / total) * 100));

  return (
    <div className={cn('rounded-xl p-5 border shadow-sm', config.bg)}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-semibold text-gray-700">{config.label}</span>
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
      </div>
      <div className="w-full bg-white/70 rounded-full h-2 mb-2 overflow-hidden">
        <div
          className={cn('h-2 rounded-full transition-all duration-300', config.bar)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={balance.usedDays}
          aria-valuemin={0}
          aria-valuemax={balance.totalDays}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{balance.usedDays} used</span>
        <span>{balance.totalDays} total</span>
      </div>
    </div>
  );
}
