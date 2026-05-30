import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Request } from 'express';
import { ConflictException, UnAuthorizedException } from 'exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { env } from 'env';

export const Public = () => SetMetadata(env.PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt_service: JwtService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req?.headers?.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(env.PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnAuthorizedException('Invalid token');

    try {
      const payload = (await this.jwt_service.verifyAsync(token)) as {
        sub: string;
        email: string;
      };

      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new ConflictException('User not found');

      const { password, ...rest } = user;

      req['user'] = rest;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
