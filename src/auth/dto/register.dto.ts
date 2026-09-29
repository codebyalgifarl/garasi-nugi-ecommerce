import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
    fullName: string;

    @IsEmail({}, { message: 'Format email tidak valid' })
    email: string;

    @MinLength(8, { message: 'Password minimal 8 karakter' })
    password: string;
}