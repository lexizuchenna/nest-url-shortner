import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'shared/response.dto';

class User {
  @ApiProperty({
    example: 'b47f4bba-e068-48f3-95f4-18481041cc74',
    description: 'The users unique identifier',
  })
  id: string;

  @ApiProperty({ example: 'Alexander Ukwueze', description: "The user's name" })
  name: string;

  @ApiProperty({
    example: 'noreply@mail.lexiz.is-a.dev',
    description: "The user's email address",
  })
  email: string;

  @ApiProperty({ type: Date, description: 'The creation dated ' })
  created_at: Date;
}

class CreateUserData {
  @ApiProperty({ description: 'Thie new users data' })
  user: User;

  @ApiProperty({
    description: 'Signed JWT for the created user',
    example: 'eyJhbGciOiJIUz...',
  })
  token: string;
}

class LoginUserData {
  @ApiProperty({ description: 'The logged in users data' })
  user: User;

  @ApiProperty({
    description: 'The signed JWT token',
    example: 'eyJhbGciOiJIUz...',
  })
  token: string;
}

class GetUserData {
  user: User;
}

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'Alexander Ukwueze',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'noreply@mail.lexiz.is-a.dev',
    description: 'The users email address',
  })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'The users chosen password',
  })
  password: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'The confirmation password',
  })
  confirm_password: string;
}

export class CreateUserResponseDto extends BaseResponseDto(CreateUserData) {}

export class LoginUserRequestDto {
  @ApiProperty({
    example: 'noreply@mail.lexiz.is-a.dev',
    description: 'The users email address',
  })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'The users chosen password',
  })
  password: string;
}

export class LoginUserResponseDto extends BaseResponseDto(LoginUserData) {}

export class GetUserResDto extends BaseResponseDto(GetUserData) {}

export class UpdatePasswordDto {
  current_password: string;
  password: string;
  confirm_password: string;
}
