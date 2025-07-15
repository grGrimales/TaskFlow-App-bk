import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }


  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {

    const existingUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const user = await this.usersService.create(signUpDto);
    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
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
    return { access_token: token };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }


  async login(user: any) {
    const payload = { email: user.email, sub: user._id };

    // Generamos ambos tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    // Guardamos el hash del refresh token en el usuario (para mayor seguridad)
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.setCurrentRefreshToken(user._id, hashedRefreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Acceso denegado.');
    }

    // Comparamos el refresh token recibido con el que está en la BD
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acceso denegado.');
    }

    // Si todo es correcto, generamos un nuevo access token
    const payload = { email: user.email, sub: user._id };
    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return {
      access_token: newAccessToken,
    };
  }
}