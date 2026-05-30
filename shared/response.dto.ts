import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;

  constructor(message: string, data?: T, statusCode = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export function BaseResponseDto<T>(DataClass: Type<T>) {
  class ResponseDto {
    @ApiProperty({ description: 'Status of the api request', example: true })
    status: boolean;

    @ApiProperty({
      description: 'Message related to the request',
      example: 'Your operation was successful',
    })
    message: string;

    @ApiProperty({ description: 'The requests status code', example: 200 })
    statusCode: number;

    @ApiProperty({ type: DataClass })
    data: T;
  }

  Object.defineProperty(ResponseDto, 'name', {
    value: `BaseResponse<${DataClass.name}>`,
  });

  return ResponseDto;
}
