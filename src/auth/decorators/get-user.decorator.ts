import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

/**
 * Custom decorator untuk mengambil data user yang sudah terautentikasi dari request.
 * Gunakan bersama @UseGuards(JwtAuthGuard).
 *
 * @example
 * @Get('me')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@GetUser() user: AuthenticatedUser) { ... }
 */
export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);
