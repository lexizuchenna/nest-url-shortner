import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message = 'Requested resource not found') {
    super(
      { statusCode: HttpStatus.NOT_FOUND, error: 'Not found', message },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(
      { statusCode: HttpStatus.BAD_REQUEST, error: 'Bad Request', message },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Confict detected',
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(message: string) {
    super(
      { statusCode: HttpStatus.UNAUTHORIZED, error: 'Not Authorized', message },
      HttpStatus.NOT_FOUND,
    );
  }
}
