import { ReactNode } from 'react';
import { Button } from './ui/Button';

type EmptyVariant = 'no-data' | 'no-results' | 'error';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

function ClipboardIllustration() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="20" y="16" width="40" height="52" rx="4" stroke="#d1d5db" strokeWidth="2" fill="#f9fafb" />
      <rect x="30" y="10" width="20" height="10" rx="3" stroke="#d1d5db" strokeWidth="2" fill="white" />
      <line x1="30" y1="34" x2="50" y2="34" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="42" x2="50" y2="42" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="50" x2="42" y2="50" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="34" cy="34" r="18" stroke="#d1d5db" strokeWidth="2" fill="#f9fafb" />
      <line x1="47" y1="47" x2="62" y2="62" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
      <line x1="27" y1="34" x2="41" y2="34" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="27" x2="34" y2="41" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="26" stroke="#fca5a5" strokeWidth="2" fill="#fef2f2" />
      <line x1="40" y1="28" x2="40" y2="44" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="51" r="2" fill="#f87171" />
    </svg>
  );
}

const illustrations: Record<EmptyVariant, ReactNode> = {
  'no-data': <ClipboardIllustration />,
  'no-results': <SearchIllustration />,
  'error': <ErrorIllustration />,
};

export function EmptyState({
  variant = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="mb-5">
        {icon ? (
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
            {icon}
          </div>
        ) : (
          illustrations[variant]
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1.5 max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
