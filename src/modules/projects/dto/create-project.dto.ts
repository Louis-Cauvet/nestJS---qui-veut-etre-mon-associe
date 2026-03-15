import { IsString, MinLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  interests?: string[];
}