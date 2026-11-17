export type LeaveType = 'SICK' | 'CASUAL' | 'ANNUAL';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  employee?: {
    name: string;
    email?: string;
    department?: string;
  };
  reviewer?: {
    name: string;
  };
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  year: number;
}
// add: LeaveFormData interface
