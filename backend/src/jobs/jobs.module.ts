import { Module } from '@nestjs/common';
import { DigestJob } from './digest.job';

@Module({
  providers: [DigestJob],
  exports: [DigestJob],
})
export class JobsModule {}
