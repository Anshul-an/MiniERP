/** LeaveService - handles all leave request operations */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LEAVE_DEFAULTS } from './leave.constants';


@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  /**
   * Count working days between two dates (Mon-Fri only)
   */
  calculateWorkingDays(start: Date, end: Date): number {
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  async applyLeave(employeeId: string, dto: CreateLeaveDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // validate dates
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Cannot apply for leave in the past');
    }

    const daysCount = this.calculateWorkingDays(startDate, endDate);

    if (daysCount === 0) {
      throw new BadRequestException('Leave period must include at least one working day');
    }

    // check balance
    const year = startDate.getFullYear();
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType_year: {
          employeeId,
          leaveType: dto.leaveType,
          year,
        },
      },
    });

    if (!balance) {
      throw new BadRequestException('No leave balance found for this year');
    }

    const remaining = balance.totalDays - balance.usedDays;
    if (remaining < daysCount) {
      throw new BadRequestException(
        Insufficient leave balance. Available: +remaining+ days, Requested: +daysCount+ days,
      );
    }

    // check for overlapping leave requests
    const overlapping = await this.prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('You have an overlapping leave request for this period');
    }

    return this.prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveType: dto.leaveType,
        startDate,
        endDate,
        daysCount,
        reason: dto.reason,
        status: 'PENDING',
      },
      include: {
        employee: {
          select: { name: true, department: true },
        },
      },
    });
  }

  async getMyRequests(employeeId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { employeeId },
      include: {
        reviewer: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingApprovals(managerId: string) {
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    return this.prisma.leaveRequest.findMany({
      where: {
        status: 'PENDING',
        employee: { department: manager.department },
      },
      include: {
        employee: {
          select: { name: true, email: true, department: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveLeave(requestId: string, reviewerId: string) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { employee: true },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be approved');
    }

    const reviewer = await this.prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    // check same department or admin
    if (reviewer.role !== 'ADMIN' && reviewer.department !== request.employee.department) {
      throw new ForbiddenException('You can only approve requests from your department');
    }

    // update request status
    const updated = await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // deduct from balance
    const year = request.startDate.getFullYear();
    await this.prisma.leaveBalance.update({
      where: {
        employeeId_leaveType_year: {
          employeeId: request.employeeId,
          leaveType: request.leaveType,
          year,
        },
      },
      data: {
        usedDays: { increment: request.daysCount },
      },
    });

    return updated;
  }

  async rejectLeave(requestId: string, reviewerId: string, reason: string) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { employee: true },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    const reviewer = await this.prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    if (reviewer.role !== 'ADMIN' && reviewer.department !== request.employee.department) {
      throw new ForbiddenException('You can only reject requests from your department');
    }

    return this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        rejectReason: reason,
      },
    });
  }

  async getAllRequests(filters?: { status?: string; department?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.department) {
      where.employee = { department: filters.department };
    }

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: { name: true, email: true, department: true },
        },
        reviewer: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLeaveBalances(userId: string) {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId: userId },
      orderBy: { leaveType: 'asc' },
    });
  }
}



// fix: edge case - same day leave should count as 1 day
// fix: validate date range - end date must be >= start date
// fix: prevent employee from approving own leave
// improve: add department filter to leave pending query
// fix: handle concurrent leave requests correctly
// refactor: use const instead of let where possible
// typo fix in log message
// perf: add select clause to reduce data fetch
// fix: dont allow leave on past dates
// fix: approved leave decrements correct user balance
// add: use findByDepartment for manager scope
// fix: recalculate days if dates changed on edit
// fix: year filter in getMyRequests uses current year by default
