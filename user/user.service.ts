import { HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import type { Request } from 'express';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnAuthorizedException,
} from 'exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserRequestDto, LoginUserRequestDto } from './user.dto';
import { test_email } from 'utils/test';
import { ApiResponse } from 'shared/response.dto';
import { JwtService } from '@nestjs/jwt';
import { users } from 'prisma/generated/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt_service: JwtService,
  ) {}

  async create(body: CreateUserRequestDto) {
    const { name, email, password, confirm_password } = body;
    if (!name)
      throw new BadRequestException('Name is required to create an account');
    if (!email)
      throw new BadRequestException('Email is required to create an account');
    if (!password)
      throw new BadRequestException(
        'Password is required to create an account',
      );
    if (!confirm_password)
      throw new BadRequestException(
        'Confirmation password is required to create an account',
      );

    if (!test_email.test(email))
      throw new BadRequestException('Invaid email address');

    if (password !== confirm_password)
      throw new BadRequestException('Passwords not not match');

    const is_user = await this.prisma.users.findUnique({ where: { email } });

    if (is_user) throw new ConflictException('Email address already exists');

    const hashed_pwd = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashed_pwd,
      },
    });

    const access_token = await this.jwt_service.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '7d' },
    );

    const data = {
      user: JSON.parse(JSON.stringify(user)),
      token: access_token,
    };

    delete data.user.password;

    return new ApiResponse(
      'User created successfully',
      data,
      HttpStatus.CREATED,
    );
  }

  async login(body: LoginUserRequestDto) {
    const { email, password } = body;
    if (!email || !password)
      throw new BadRequestException('Missing email or password');

    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user)
      throw new UnAuthorizedException('Invalid email address or password');

    const is_match = await bcrypt.compare(password, user.password);

    if (!is_match)
      throw new UnAuthorizedException('Invalid email address or password');

    const access_token = await this.jwt_service.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '7d' },
    );

    delete (user as Partial<users>).password;

    return new ApiResponse('User successfully signed in', {
      user,
      token: access_token,
    });
  }

  getProfile(req: Request) {
    const { password, ...user } = req.user as users;
    return new ApiResponse('User retrieved successfully', { user });
  }
}
