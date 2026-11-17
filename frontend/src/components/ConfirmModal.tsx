import { Modal } from './Modal';
import { cn } from '../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'red' | 'blue' | 'green';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'blue',
  loading = false,
}: ConfirmModalProps) {
  const colorMap = {
    red: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    blue: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6 text-sm">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg transition-all active:scale-95 disabled:opacity-50',
            colorMap[confirmColor]
          )}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
