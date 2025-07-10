// src/columns/dto/create-column.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty({ message: 'El nombre de la columna es requerido.' })
  @IsString()
  @MaxLength(100)
  name: string;
}