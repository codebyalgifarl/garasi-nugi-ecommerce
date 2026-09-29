import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email sudah terdaftar, silakan gunakan email lain',
      });
    }

    // 2. Hash password SEBELUM disimpan (jangan pernah simpan password asli!)
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 3. Simpan user baru ke database
    const newUser = await this.prisma.users.create({
      data: {
        full_name: dto.fullName,
        email: dto.email,
        password_hash: passwordHash,
      },
    });

    // 4. Jangan pernah kembalikan password_hash ke response!
    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(dto: LoginDto) {
    // 1. Cari user berdasarkan email
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    // 2. Validasi: user tidak ditemukan atau password salah
    // Gunakan pesan error yang sama untuk mencegah user enumeration attack
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email atau password tidak valid',
      });
    }

    // 3. Pastikan akun aktif
    if (!user.is_active) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_INACTIVE',
        message: 'Akun Anda tidak aktif, hubungi administrator',
      });
    }

    // 4. Generate JWT token dengan payload minimal (principle of least privilege)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // 5. Kembalikan token + data user (tanpa password_hash)
    const { password_hash: _, ...userWithoutPassword } = user;
    return {
      access_token: accessToken,
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'User tidak ditemukan',
      });
    }

    return user;
  }
}