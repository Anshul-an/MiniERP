export interface DashboardData {
  totalEmployees?: number;
  pendingLeaveApprovals?: number;
  pendingPurchaseApprovals?: number;
  pendingManagerPurchases?: number;
  monthlySpend?: Array<{ month: string; total: number }>;
  leaveStats?: Array<{ type: string; count: number }>;
  recentActivity?: Array<{
    type: string;
    description: string;
    status: string;
    date: string;
  }>;
  department?: string;
  teamSize?: number;
  myTeamPendingLeaves?: number;
  teamLeaveCalendar?: Array<any>;
  leaveBalances?: Array<any>;
  myPendingLeaveCount?: number;
  myPendingPurchaseCount?: number;
  recentLeaves?: Array<any>;
  recentPurchases?: Array<any>;
}
