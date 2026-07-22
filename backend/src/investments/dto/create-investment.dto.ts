import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  investmentName: string;

  @IsString()
  @IsNotEmpty()
  investmentType: string;

  @IsNumber()
  @Min(0, { message: 'Invested amount must be non-negative' })
  investedAmount: number;

  @IsNumber()
  @Min(0, { message: 'Current value must be non-negative' })
  currentValue: number;

  @IsDateString()
  @IsNotEmpty()
  purchaseDate: string;
}
