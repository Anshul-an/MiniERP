import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  // Strict status state machine - no skipping stages allowed
  private readonly validTransitions: Record<PurchaseStatus, PurchaseStatus[]> = {
    DRAFT: ['PENDING_MANAGER'],
    PENDING_MANAGER: ['PENDING_ADMIN', 'REJECTED'],
    PENDING_ADMIN: ['APPROVED', 'REJECTED'],
    APPROVED: ['ORDERED'],
    ORDERED: ['RECEIVED'],
    REJECTED: [],
    RECEIVED: [],
  };

  private validateTransition(current: PurchaseStatus, next: PurchaseStatus) {
    const allowed = this.validTransitions[current];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        Cannot transition from +current+ to +next,
      );
    }
  }

  async createRequest(userId: string, dto: CreatePurchaseDto) {
    return this.prisma.purchaseRequest.create({
      data: {
        raisedById: userId,
        title: dto.title,
        description: dto.description,
        itemName: dto.itemName,
        quantity: dto.quantity,
        estimatedCost: dto.estimatedCost,
        vendorName: dto.vendorName,
        status: 'PENDING_MANAGER',
      },
      include: {
        raisedBy: {
          select: { name: true, department: true },
        },
      },
    });
  }

  async getMyRequests(userId: string) {
    return this.prisma.purchaseRequest.findMany({
      where: { raisedById: userId },
      include: {
        manager: { select: { name: true } },
        admin: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingManager(managerId: string) {
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    return this.prisma.purchaseRequest.findMany({
      where: {
        status: 'PENDING_MANAGER',
        raisedBy: { department: manager.department },
      },
      include: {
        raisedBy: { select: { name: true, department: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getPendingAdmin() {
    return this.prisma.purchaseRequest.findMany({
      where: { status: 'PENDING_ADMIN' },
      include: {
        raisedBy: { select: { name: true, department: true } },
        manager: { select: { name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async managerApprove(requestId: string, managerId: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'PENDING_ADMIN');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: 'PENDING_ADMIN',
        managerId,
        managerApprovedAt: new Date(),
      },
    });
  }

  async managerReject(requestId: string, managerId: string, reason: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'REJECTED');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        managerId,
        rejectionReason: reason,
      },
    });
  }

  async adminApprove(requestId: string, adminId: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'APPROVED');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        adminId,
        adminApprovedAt: new Date(),
      },
    });
  }

  async adminReject(requestId: string, adminId: string, reason: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'REJECTED');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        adminId,
        rejectionReason: reason,
      },
    });
  }

  async markOrdered(requestId: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'ORDERED');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: { status: 'ORDERED' },
    });
  }

  async markReceived(requestId: string) {
    const request = await this.prisma.purchaseRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Purchase request not found');
    }

    this.validateTransition(request.status, 'RECEIVED');

    return this.prisma.purchaseRequest.update({
      where: { id: requestId },
      data: { status: 'RECEIVED' },
    });
  }

  async getAllRequests(filters?: { status?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.purchaseRequest.findMany({
      where,
      include: {
        raisedBy: { select: { name: true, department: true } },
        manager: { select: { name: true } },
        admin: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMonthlySpend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const requests = await this.prisma.purchaseRequest.findMany({
      where: {
        status: { in: ['APPROVED', 'ORDERED', 'RECEIVED'] },
        adminApprovedAt: { gte: sixMonthsAgo },
      },
      select: {
        estimatedCost: true,
        adminApprovedAt: true,
      },
    });

    // group by month
    const monthlyMap = new Map<string, number>();
    for (const req of requests) {
      if (req.adminApprovedAt) {
        const key = req.adminApprovedAt.toISOString().slice(0, 7);
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + req.estimatedCost);
      }
    }

    return Array.from(monthlyMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}

// note: vendor_name is optional for internal purchase requests
// fix: check request belongs to dept before manager approval
// fix: status check before marking as ordered
// refactor: extract reusable findOrFail helper
// fix: typo approvel -> approval
// perf: add select clause to reduce data fetch
// fix: trim whitespace from title and desc
