import { Module } from '@nestjs/common';
import { DigestJob } from './digest.job';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [DigestJob],
  exports: [DigestJob],
})
export class JobsModule {}
