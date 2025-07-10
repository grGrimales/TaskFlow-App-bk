// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const existingUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const user = await this.usersService.create(signUpDto);
    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordMatching = await bcrypt.compare(signInDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user._id, email: user.email, roles: user.roles };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}