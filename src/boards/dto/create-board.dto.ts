import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty({ message: 'El nombre del tablero es requerido.' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}