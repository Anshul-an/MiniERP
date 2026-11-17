export type LeaveStatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveTypeEnum = 'SICK' | 'CASUAL' | 'ANNUAL';

export interface LeaveRequestResponse {
  id: number;
  leaveType: LeaveTypeEnum;
  startDate: Date;
  endDate: Date;
  daysCount: number;
  reason: string;
  status: LeaveStatusType;
  reviewedAt?: Date;
  createdAt: Date;
  employee: { id: number; name: string; email: string; department: string };
  reviewer?: { id: number; name: string } | null;
}
// add: LeaveApprovalResponse type
