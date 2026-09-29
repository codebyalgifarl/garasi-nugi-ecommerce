import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import type { AuthenticatedUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * Mendaftarkan user baru.
   * Mengembalikan 201 Created + data user (tanpa password_hash).
   */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Login dengan email + password.
   * Mengembalikan 200 OK + access_token JWT + data user.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * GET /auth/me
   * Mengambil profil user yang sedang login.
   * Membutuhkan Authorization: Bearer <token>
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.userId);
  }
}
