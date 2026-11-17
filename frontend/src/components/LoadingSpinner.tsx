export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${sizes[size]}`} />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${height} ${width} ${className}`}
    />
  );
}
