import { IsString, MinLength } from 'class-validator';

export class RejectLeaveDto {
  @IsString()
  @MinLength(5)
  reason: string;
}
