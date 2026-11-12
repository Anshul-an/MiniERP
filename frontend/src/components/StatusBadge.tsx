interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border border-red-200',
  PENDING_MANAGER: 'bg-blue-100 text-blue-800 border border-blue-200',
  PENDING_ADMIN: 'bg-purple-100 text-purple-800 border border-purple-200',
  DRAFT: 'bg-gray-100 text-gray-700 border border-gray-200',
  ORDERED: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  RECEIVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  SICK: 'bg-red-100 text-red-700',
  CASUAL: 'bg-blue-100 text-blue-700',
  ANNUAL: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  PENDING_MANAGER: 'Pending Manager',
  PENDING_ADMIN: 'Pending Admin',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-700';
  const label = statusLabels[status] || status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span className={inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium +color}>
      {label}
    </span>
  );
}
// StatusBadge: add ORDERED and RECEIVED variants for purchase status
