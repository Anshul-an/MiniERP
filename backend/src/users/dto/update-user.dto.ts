import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
