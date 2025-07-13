// src/tasks/dto/update-task.dto.ts
import { IsOptional, IsString, MaxLength, IsDateString, IsEnum , IsArray} from 'class-validator';
import { Priority } from '../schemas/task.schema';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}