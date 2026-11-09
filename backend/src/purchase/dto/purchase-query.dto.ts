import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';

export enum PurchaseStatusFilter {
  PENDING_MANAGER = 'PENDING_MANAGER',
  PENDING_ADMIN = 'PENDING_ADMIN',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ALL = 'ALL',
}

export class PurchaseQueryDto {
  @IsOptional()
  @IsEnum(PurchaseStatusFilter)
  status?: PurchaseStatusFilter;

  @IsOptional()
  @IsNumberString()
  raisedBy?: string;

  @IsOptional()
  @IsString()
  month?: string;
}
