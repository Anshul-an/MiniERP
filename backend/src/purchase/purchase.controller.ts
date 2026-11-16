import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { RejectPurchaseDto } from './dto/reject-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('purchase')
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post('create')
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchaseService.createRequest(userId, dto);
  }

  @Get('my-requests')
  async getMyRequests(@CurrentUser('id') userId: string) {
    return this.purchaseService.getMyRequests(userId);
  }

  @Get('pending-manager')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async getPendingManager(@CurrentUser('id') managerId: string) {
    return this.purchaseService.getPendingManager(managerId);
  }

  @Get('pending-admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getPendingAdmin() {
    return this.purchaseService.getPendingAdmin();
  }

  @Patch(':id/manager-approve')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async managerApprove(
    @Param('id') id: string,
    @CurrentUser('id') managerId: string,
  ) {
    return this.purchaseService.managerApprove(id, managerId);
  }

  @Patch(':id/manager-reject')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async managerReject(
    @Param('id') id: string,
    @CurrentUser('id') managerId: string,
    @Body() dto: RejectPurchaseDto,
  ) {
    return this.purchaseService.managerReject(id, managerId, dto.reason);
  }

  @Patch(':id/admin-approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async adminApprove(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.purchaseService.adminApprove(id, adminId);
  }

  @Patch(':id/admin-reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async adminReject(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: RejectPurchaseDto,
  ) {
    return this.purchaseService.adminReject(id, adminId, dto.reason);
  }

  @Patch(':id/mark-ordered')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async markOrdered(@Param('id') id: string) {
    return this.purchaseService.markOrdered(id);
  }

  @Patch(':id/mark-received')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async markReceived(@Param('id') id: string) {
    return this.purchaseService.markReceived(id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAll(@Query('status') status?: string) {
    return this.purchaseService.getAllRequests({ status });
  }

  @Get('monthly-spend')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getMonthlySpend() {
    return this.purchaseService.getMonthlySpend();
  }
}
// fix: return 201 on create not 200
