import { IsArray, IsEmail } from 'class-validator';

export class AddMembersDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}