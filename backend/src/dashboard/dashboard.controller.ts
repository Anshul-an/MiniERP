import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('manager')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async getManagerDashboard(@CurrentUser('id') managerId: string) {
    return this.dashboardService.getManagerDashboard(managerId);
  }

  @Get('employee')
  async getEmployeeDashboard(@CurrentUser('id') userId: string) {
    return this.dashboardService.getEmployeeDashboard(userId);
  }
}
