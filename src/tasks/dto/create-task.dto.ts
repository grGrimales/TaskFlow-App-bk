// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString, IsEnum, IsArray } from 'class-validator';
import { Priority } from '../schemas/task.schema';
import { Label } from '../../labels/schemas/label.schema'; // Importa Label


export class CreateTaskDto {
  @IsNotEmpty({ message: 'El título de la tarea es requerido.' })
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;


   @IsArray()
  @IsOptional()
  labels?: Partial<Label>[];

  @IsNotEmpty({ message: 'El ID del tablero es requerido.' })
  @IsString()
  @IsOptional()
   board: string;


}