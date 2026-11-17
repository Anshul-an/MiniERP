import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DigestJob {
  private readonly logger = new Logger(DigestJob.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 9 * * *')
  async sendPendingApprovalDigest() {
    this.logger.log('Running daily pending approval digest...');

    const managers = await this.prisma.user.findMany({
      where: { role: { in: ['MANAGER', 'ADMIN'] }, isActive: true },
      select: { id: true, name: true, email: true, department: true },
    });

    for (const manager of managers) {
      const pendingLeaves = await this.prisma.leaveRequest.count({
        where: {
          status: 'PENDING',
          employee: { department: manager.department },
        },
      });

      const pendingPurchases = await this.prisma.purchaseRequest.count({
        where: { status: 'PENDING_MANAGER' },
      });

      if (pendingLeaves > 0 || pendingPurchases > 0) {
        this.logger.log(
          '[Digest] ' + manager.name + ' (' + manager.email + '): ' +
          pendingLeaves + ' pending leaves, ' + pendingPurchases + ' pending purchases',
        );
      }
    }

    this.logger.log('Daily digest complete.');
  }

  @Cron('0 0 1 * *')
  async resetMonthlyLeaveBalances() {
    this.logger.log('Running monthly leave balance reset...');

    const year = new Date().getFullYear();

    await this.prisma.leaveBalance.updateMany({
      where: { leaveType: 'CASUAL', year },
      data: { usedDays: 0 },
    });

    this.logger.log('Monthly CASUAL leave balances reset to 0 used days.');
  }

  async triggerDigestManually() {
    await this.sendPendingApprovalDigest();
    return { triggered: true, timestamp: new Date().toISOString() };
  }
}
// wip: thinking about adding email notifications
// TODO: add nodemailer integration
// For now, logging to console is sufficient for demo purposes
// fix: cron expression is correct - 0 9 * * *
// fix: monthly reset uses 0 0 1 * * correctly
// improve: log manager name in digest output
