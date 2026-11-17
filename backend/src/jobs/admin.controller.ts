import { Controller, Get, UseGuards } from '@nestjs/common';
import { DigestJob } from '../jobs/digest.job';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private digestJob: DigestJob) {}

  @Get('trigger-digest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async triggerDigest() {
    return this.digestJob.triggerDigestManually();
  }
}
// improve: return success message from trigger-digest
// fix: trigger-digest is admin-only
// add: manual monthly reset endpoint
