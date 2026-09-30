import { ApiProperty } from '@nestjs/swagger';

// ─── Shared ────────────────────────────────────────────────────────────────

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID pengguna' })
  id: string;

  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap pengguna' })
  full_name: string;

  @ApiProperty({ example: 'budi@example.com', description: 'Alamat email pengguna' })
  email: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'customer', enum: ['customer', 'admin'], description: 'Role pengguna' })
  role: string;

  @ApiProperty({ example: true, description: 'Status aktif akun' })
  is_active: boolean;

  @ApiProperty({ example: '2026-09-29T06:00:00.000Z', description: 'Waktu akun dibuat' })
  created_at: Date;

  @ApiProperty({ example: '2026-09-29T06:00:00.000Z', description: 'Waktu akun terakhir diupdate' })
  updated_at: Date;
}

// ─── Register ──────────────────────────────────────────────────────────────

export class RegisterResponseDto extends UserResponseDto {}

// ─── Login ─────────────────────────────────────────────────────────────────

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkIiwiZW1haWwiOiJidWRpQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDA2MDQ4MDB9.signature',
    description: 'JWT Bearer token. Sertakan di header: Authorization: Bearer <token>',
  })
  access_token: string;

  @ApiProperty({ type: UserResponseDto, description: 'Data pengguna yang berhasil login' })
  user: UserResponseDto;
}

// ─── Error ─────────────────────────────────────────────────────────────────

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Format email tidak valid',
    description: 'Pesan error. Bisa string tunggal atau array (validation errors)',
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({
    example: { code: 'EMAIL_ALREADY_EXISTS', message: 'Email sudah terdaftar, silakan gunakan email lain' },
    description: 'Detail error konflik',
  })
  message: { code: string; message: string };

  @ApiProperty({ example: 'Conflict' })
  error: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({
    example: { code: 'INVALID_CREDENTIALS', message: 'Email atau password tidak valid' },
    description: 'Detail error autentikasi',
  })
  message: { code: string; message: string };

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
