export type PurchaseStatusType =
  | 'DRAFT'
  | 'PENDING_MANAGER'
  | 'PENDING_ADMIN'
  | 'APPROVED'
  | 'REJECTED'
  | 'ORDERED'
  | 'RECEIVED';

export interface PurchaseStatusStep {
  status: PurchaseStatusType;
  label: string;
  order: number;
}

export const PURCHASE_STATUS_STEPS: PurchaseStatusStep[] = [
  { status: 'DRAFT', label: 'Draft', order: 0 },
  { status: 'PENDING_MANAGER', label: 'Manager Review', order: 1 },
  { status: 'PENDING_ADMIN', label: 'Admin Review', order: 2 },
  { status: 'APPROVED', label: 'Approved', order: 3 },
  { status: 'ORDERED', label: 'Ordered', order: 4 },
  { status: 'RECEIVED', label: 'Received', order: 5 },
];
// add: REJECTED step in status steps
// add: PurchaseApprovalResponse type
