import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}