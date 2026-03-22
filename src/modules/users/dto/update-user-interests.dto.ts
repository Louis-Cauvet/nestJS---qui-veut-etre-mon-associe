import { IsArray, IsUUID } from 'class-validator';

export class UpdateUserInterestsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  interests: string[];
}
