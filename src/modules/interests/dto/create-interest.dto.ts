import { IsString, MinLength } from 'class-validator';

export class CreateInterestDto {

  @IsString()
  @MinLength(2)
  name: string;

}