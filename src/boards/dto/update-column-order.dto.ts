// src/boards/dto/update-column-order.dto.ts
import { IsArray, IsMongoId } from 'class-validator';

export class UpdateColumnOrderDto {
  @IsArray()
  @IsMongoId({ each: true })
  columnIds: string[];
}