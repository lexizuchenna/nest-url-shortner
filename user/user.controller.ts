import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  GetUserResDto,
  LoginUserRequestDto,
  LoginUserResponseDto,
} from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'guard/auth.guard';
import type { Request as Req } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created.',
    type: CreateUserResponseDto,
  })
  async create(@Body() body: CreateUserRequestDto) {
    return this.userService.create(body);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in',
    type: LoginUserResponseDto,
  })
  async login(@Body() body: LoginUserRequestDto) {
    return this.userService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Gets user data',
    description: 'Returns the user data of the currently logged in user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data',
    type: GetUserResDto,
  })
  @ApiBearerAuth()
  getProfile(@Request() req: Req) {
    return this.userService.getProfile(req);
  }
}
