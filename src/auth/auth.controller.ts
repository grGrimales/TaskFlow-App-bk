import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

@UseGuards(AuthGuard('jwt')) 
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}

  @Post('refresh')
  async refreshToken(@Body() body: { userId: string; refreshToken: string }) {
    if (!body.userId || !body.refreshToken) {
        throw new Error('UserId y RefreshToken son requeridos');
    }
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }
}