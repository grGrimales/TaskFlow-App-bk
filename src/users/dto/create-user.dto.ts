
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El formato del correo no es válido.' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;
}