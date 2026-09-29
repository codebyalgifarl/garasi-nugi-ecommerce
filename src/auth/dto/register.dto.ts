import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'Budi Santoso',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  fullName: string;

  @ApiProperty({
    description: 'Alamat email unik pengguna',
    example: 'budi@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Password akun (minimal 8 karakter)',
    example: 'password123',
    minLength: 8,
    format: 'password',
  })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}