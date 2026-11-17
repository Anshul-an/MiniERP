export type PurchaseStatus =
  | 'DRAFT'
  | 'PENDING_MANAGER'
  | 'PENDING_ADMIN'
  | 'APPROVED'
  | 'REJECTED'
  | 'ORDERED'
  | 'RECEIVED';

export interface PurchaseRequest {
  id: string;
  raisedById: string;
  title: string;
  description: string;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  vendorName: string | null;
  status: PurchaseStatus;
  managerId: string | null;
  managerApprovedAt: string | null;
  adminId: string | null;
  adminApprovedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  raisedBy?: { name: string; department?: string };
  manager?: { name: string };
  admin?: { name: string };
}
// add: PurchaseFormData interface
