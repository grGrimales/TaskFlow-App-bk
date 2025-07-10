// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'El título de la tarea es requerido.' })
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}