import { Check, X, Clock } from 'lucide-react';
import type { PurchaseStatus } from '../types';

interface ApprovalTimelineProps {
  status: PurchaseStatus;
}

const steps = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'manager', label: 'Manager Review' },
  { key: 'admin', label: 'Admin Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'fulfilled', label: 'Fulfilled' },
];

function getStepIndex(status: PurchaseStatus): number {
  switch (status) {
    case 'DRAFT': return 0;
    case 'PENDING_MANAGER': return 1;
    case 'PENDING_ADMIN': return 2;
    case 'APPROVED': return 3;
    case 'ORDERED': return 4;
    case 'RECEIVED': return 5;
    case 'REJECTED': return -1;
    default: return 0;
  }
}

function getRejectedAt(status: PurchaseStatus): number {
  if (status !== 'REJECTED') return -1;
  return -1;
}

export function ApprovalTimeline({ status }: ApprovalTimelineProps) {
  const currentStep = getStepIndex(status);
  const isRejected = status === 'REJECTED';

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, index) => {
        const isDone = currentStep > index;
        const isCurrent = currentStep === index + 1;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors +
                  (isRejected && isCurrent
                    ? 'bg-red-500 text-white'
                    : isDone || currentStep >= index + 1
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500')
                }
              >
                {isRejected && isCurrent ? (
                  <X className="w-3 h-3" />
                ) : isDone || currentStep > index ? (
                  <Check className="w-3 h-3" />
                ) : isCurrent ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 text-center leading-tight w-14">
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={h-0.5 flex-1 mx-1 +
                  (currentStep > index + 1 ? 'bg-green-400' : 'bg-gray-200')
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
