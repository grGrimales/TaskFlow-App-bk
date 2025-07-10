import { IsArray, IsMongoId } from 'class-validator';
export class AssignUsersDto {
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];
}