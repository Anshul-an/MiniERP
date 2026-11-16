import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  subtitle?: string;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

export function StatCard({ title, value, icon, color = 'blue', subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      {icon && (
        <div className={cn('p-3 rounded-xl border', colorMap[color])}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
// improve StatCard hover effect
// refactor: accept icon as component prop
