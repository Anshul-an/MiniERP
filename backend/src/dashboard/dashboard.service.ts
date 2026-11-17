import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const totalEmployees = await this.prisma.user.count({
      where: { isActive: true },
    });

    const pendingLeaveApprovals = await this.prisma.leaveRequest.count({
      where: { status: 'PENDING' },
    });

    const pendingPurchaseApprovals = await this.prisma.purchaseRequest.count({
      where: { status: 'PENDING_ADMIN' },
    });

    const pendingManagerPurchases = await this.prisma.purchaseRequest.count({
      where: { status: 'PENDING_MANAGER' },
    });

    // monthly spend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const approvedRequests = await this.prisma.purchaseRequest.findMany({
      where: {
        status: { in: ['APPROVED', 'ORDERED', 'RECEIVED'] },
        adminApprovedAt: { gte: sixMonthsAgo },
      },
      select: {
        estimatedCost: true,
        adminApprovedAt: true,
      },
    });

    const monthlySpend = new Map<string, number>();
    for (const req of approvedRequests) {
      if (req.adminApprovedAt) {
        const key = req.adminApprovedAt.toISOString().slice(0, 7);
        monthlySpend.set(key, (monthlySpend.get(key) || 0) + req.estimatedCost);
      }
    }

    const monthlySpendData = Array.from(monthlySpend.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // leave stats by type
    const leaveByType = await this.prisma.leaveRequest.groupBy({
      by: ['leaveType'],
      _count: { id: true },
    });

    const leaveStats = leaveByType.map((item) => ({
      type: item.leaveType,
      count: item._count.id,
    }));

    // recent activity — combine leave and purchase into unified feed
    const recentLeaves = await this.prisma.leaveRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { name: true } },
      },
    });

    const recentPurchases = await this.prisma.purchaseRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        raisedBy: { select: { name: true } },
      },
    });

    const recentActivity = [
      ...recentLeaves.map((l) => ({
        type: 'leave' as const,
        description: l.employee.name + ' applied for ' + l.leaveType.toLowerCase() + ' leave',
        status: l.status,
        date: l.createdAt,
      })),
      ...recentPurchases.map((p) => ({
        type: 'purchase' as const,
        description: p.raisedBy.name + ' raised purchase: ' + p.title,
        status: p.status,
        date: p.createdAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return {
      totalEmployees,
      pendingLeaveApprovals,
      pendingPurchaseApprovals,
      pendingManagerPurchases,
      monthlySpend: monthlySpendData,
      leaveStats,
      recentActivity,
    };
  }

  async getManagerDashboard(managerId: string) {
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      return null;
    }

    const myTeamPendingLeaves = await this.prisma.leaveRequest.count({
      where: {
        status: 'PENDING',
        employee: { department: manager.department },
      },
    });

    const pendingPurchaseApprovals = await this.prisma.purchaseRequest.count({
      where: {
        status: 'PENDING_MANAGER',
        raisedBy: { department: manager.department },
      },
    });

    // team leave calendar - approved leaves this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const teamLeaveCalendar = await this.prisma.leaveRequest.findMany({
      where: {
        status: 'APPROVED',
        employee: { department: manager.department },
        OR: [
          {
            startDate: { gte: startOfMonth, lte: endOfMonth },
          },
          {
            endDate: { gte: startOfMonth, lte: endOfMonth },
          },
        ],
      },
      include: {
        employee: { select: { name: true } },
      },
    });

    const teamSize = await this.prisma.user.count({
      where: { department: manager.department, isActive: true },
    });

    return {
      department: manager.department,
      teamSize,
      myTeamPendingLeaves,
      pendingPurchaseApprovals,
      teamLeaveCalendar,
    };
  }

  async getEmployeeDashboard(userId: string) {
    const year = new Date().getFullYear();

    const leaveBalances = await this.prisma.leaveBalance.findMany({
      where: { employeeId: userId, year },
      orderBy: { leaveType: 'asc' },
    });

    const myPendingLeaveCount = await this.prisma.leaveRequest.count({
      where: { employeeId: userId, status: 'PENDING' },
    });

    const myPendingPurchaseCount = await this.prisma.purchaseRequest.count({
      where: { raisedById: userId, status: { in: ['PENDING_MANAGER', 'PENDING_ADMIN'] } },
    });

    const recentLeaves = await this.prisma.leaveRequest.findMany({
      where: { employeeId: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentPurchases = await this.prisma.purchaseRequest.findMany({
      where: { raisedById: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      leaveBalances,
      myPendingLeaveCount,
      myPendingPurchaseCount,
      recentLeaves,
      recentPurchases,
    };
  }
}

// null check: handle case when no purchase requests exist
// refactor: extract monthlySpend calculation to helper
// add: total spend calculation includes only APPROVED/ORDERED/RECEIVED
// refactor: break down getAdminStats into smaller methods
// perf: use Promise.all for parallel queries
// fix: handle empty arrays for aggregation
// fix: monthly chart includes current month
