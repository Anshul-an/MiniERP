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
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { RejectLeaveDto } from './dto/reject-leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Post('apply')
  async apply(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLeaveDto,
  ) {
    return this.leaveService.applyLeave(userId, dto);
  }

  @Get('my-requests')
  async getMyRequests(@CurrentUser('id') userId: string) {
    return this.leaveService.getMyRequests(userId);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async getPending(@CurrentUser('id') managerId: string) {
    return this.leaveService.getPendingApprovals(managerId);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async approve(
    @Param('id') id: string,
    @CurrentUser('id') reviewerId: string,
  ) {
    return this.leaveService.approveLeave(id, reviewerId);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async reject(
    @Param('id') id: string,
    @CurrentUser('id') reviewerId: string,
    @Body() dto: RejectLeaveDto,
  ) {
    return this.leaveService.rejectLeave(id, reviewerId, dto.reason);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAll(
    @Query('status') status?: string,
    @Query('department') department?: string,
  ) {
    return this.leaveService.getAllRequests({ status, department });
  }

  @Get('balances/:userId')
  async getBalances(@Param('userId') userId: string) {
    return this.leaveService.getLeaveBalances(userId);
  }
}
// fix: return 201 on apply not 200
