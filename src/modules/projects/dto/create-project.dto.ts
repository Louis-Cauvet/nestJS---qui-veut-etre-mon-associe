import { IsString, MinLength, IsOptional, IsArray, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  budget: number;

  @IsString()
  @MinLength(2)
  category: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  interests?: string[];
}