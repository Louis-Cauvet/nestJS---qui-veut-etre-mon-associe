import { IsNumber, IsUUID } from 'class-validator';

export class CreateInvestmentDto {
  @IsNumber()
  amount: number;

  @IsUUID()
  projectId: string;
}