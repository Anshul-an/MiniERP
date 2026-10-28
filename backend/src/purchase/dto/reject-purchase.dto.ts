import { IsString, MinLength } from 'class-validator';

export class RejectPurchaseDto {
  @IsString()
  @MinLength(5)
  reason: string;
}
