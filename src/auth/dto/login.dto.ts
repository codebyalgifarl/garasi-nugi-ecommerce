import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Alamat email yang terdaftar',
    example: 'budi@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Password akun',
    example: 'password123',
    format: 'password',
  })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}