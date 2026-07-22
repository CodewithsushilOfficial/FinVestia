import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateInvestmentDto {
  @IsString()
  @IsOptional()
  investmentName?: string;

  @IsString()
  @IsOptional()
  investmentType?: string;

  @IsNumber()
  @Min(0, { message: 'Invested amount must be non-negative' })
  @IsOptional()
  investedAmount?: number;

  @IsNumber()
  @Min(0, { message: 'Current value must be non-negative' })
  @IsOptional()
  currentValue?: number;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;
}
