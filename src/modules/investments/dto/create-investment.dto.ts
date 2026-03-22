import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsUUID()
  projectId: string;
}