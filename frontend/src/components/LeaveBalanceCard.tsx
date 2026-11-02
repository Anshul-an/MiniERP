import type { LeaveBalance, LeaveType } from '../types';

const leaveColors: Record<LeaveType, { bg: string; bar: string; label: string }> = {
  SICK: { bg: 'bg-red-50', bar: 'bg-red-400', label: 'Sick Leave' },
  CASUAL: { bg: 'bg-blue-50', bar: 'bg-blue-400', label: 'Casual Leave' },
  ANNUAL: { bg: 'bg-green-50', bar: 'bg-green-400', label: 'Annual Leave' },
};

export function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const config = leaveColors[balance.leaveType];
  const remaining = balance.totalDays - balance.usedDays;
  const pct = Math.round((balance.usedDays / balance.totalDays) * 100);

  return (
    <div className={ounded-xl p-5 +config.bg}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-semibold text-gray-700">{config.label}</span>
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
      </div>
      <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-2">
        <div
          className={h-2 rounded-full +config.bar}
          style={{ width: pct+'%' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{balance.usedDays} used</span>
        <span>{balance.totalDays} total</span>
      </div>
    </div>
  );
}
