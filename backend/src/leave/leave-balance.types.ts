export interface LeaveBalanceSummary {
  SICK: { total: number; used: number; remaining: number };
  CASUAL: { total: number; used: number; remaining: number };
  ANNUAL: { total: number; used: number; remaining: number };
}
