import { IsArray, IsMongoId } from 'class-validator';

export class UpdateColumnOrderDto {
  @IsArray()
  @IsMongoId({ each: true })
  columnIds: string[];
}