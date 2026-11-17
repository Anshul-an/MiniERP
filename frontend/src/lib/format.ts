export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return '?' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '?' + (amount / 1000).toFixed(0) + 'K';
  return '?' + amount.toLocaleString('en-IN');
}

export function formatRelativeTime(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  return formatDate(date);
}
// refactor: add formatDaysCount helper
// add: formatNumber with locale
