import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}