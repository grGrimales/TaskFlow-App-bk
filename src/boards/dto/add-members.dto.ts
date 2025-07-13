// src/boards/dto/add-members.dto.ts
import { IsArray, IsEmail } from 'class-validator';

export class AddMembersDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}