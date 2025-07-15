import { IsMongoId, IsArray } from 'class-validator';

export class MoveTaskDto {
  @IsMongoId()
  sourceColumnId: string;

  @IsArray()
  @IsMongoId({ each: true })
  sourceTaskIds: string[];

  @IsMongoId()
  destinationColumnId: string;

  @IsArray()
  @IsMongoId({ each: true })
  destinationTaskIds: string[];
}