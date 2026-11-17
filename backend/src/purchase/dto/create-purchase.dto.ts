import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  itemName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  estimatedCost: number;

  @IsString()
  @IsOptional()
  vendorName?: string;
}
// add: @IsPositive for estimatedCost
