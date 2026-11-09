import { IsOptional, IsEnum, IsString } from 'class-validator';

export enum LeaveStatusFilter {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ALL = 'ALL',
}

export class LeaveQueryDto {
  @IsOptional()
  @IsEnum(LeaveStatusFilter)
  status?: LeaveStatusFilter;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  year?: string;
}
