// src-backend/labels/dto/create-label.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

    @IsString()
  @IsOptional() // Hacemos que sea opcional aquí, pero la asignaremos en el servicio.
  board?: string;
}