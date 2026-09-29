import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  RegisterResponseDto,
  LoginResponseDto,
  ErrorResponseDto,
  ConflictErrorResponseDto,
  UnauthorizedErrorResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import type { AuthenticatedUser } from './decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── POST /auth/register ─────────────────────────────────────────────────

  @Post('register')
  @ApiOperation({
    summary: 'Registrasi pengguna baru',
    description:
      'Mendaftarkan akun baru dengan nama lengkap, email, dan password. ' +
      'Password akan di-hash dengan bcrypt sebelum disimpan. ' +
      'Email bersifat unik — satu email hanya bisa dipakai untuk satu akun.',
  })
  @ApiCreatedResponse({
    description: 'Akun berhasil dibuat. Mengembalikan data user tanpa password.',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validasi gagal — field kosong, format email salah, atau password terlalu pendek.',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email sudah digunakan oleh akun lain.',
    type: ConflictErrorResponseDto,
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── POST /auth/login ────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login pengguna',
    description:
      'Autentikasi dengan email dan password. ' +
      'Jika berhasil, mengembalikan JWT Bearer token yang digunakan untuk mengakses endpoint terproteksi. ' +
      'Token berlaku selama **7 hari**.',
  })
  @ApiOkResponse({
    description: 'Login berhasil. Gunakan `access_token` di header `Authorization: Bearer <token>`.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validasi gagal — email kosong, format email salah, atau password kosong.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email tidak terdaftar, password salah, atau akun tidak aktif.',
    type: UnauthorizedErrorResponseDto,
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── GET /auth/me ─────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Profil pengguna saat ini',
    description:
      'Mengambil data profil pengguna yang sedang login berdasarkan JWT token. ' +
      'Wajib menyertakan header `Authorization: Bearer <token>`.',
  })
  @ApiOkResponse({
    description: 'Profil pengguna berhasil diambil.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token tidak valid, expired, atau tidak disertakan.',
    type: UnauthorizedErrorResponseDto,
  })
  getProfile(@GetUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.userId);
  }
}
