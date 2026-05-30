import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets the status of the API',
    description: 'Returns current health and state of the server',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Server is healthy',
      status: 'ok',
      timestamp: '2026-05-30T00:16:29.097Z',
      docs: 'http://localhost:5000/api/v1/docs',
    },
  })
  @HttpCode(HttpStatus.OK)
  async get(@Req() request: Request) {
    return this.appService.get(request);
  }

  @Get('r/:id')
  @ApiExcludeEndpoint()
  @Redirect(undefined, HttpStatus.PERMANENT_REDIRECT)
  async redirect(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ url: string }> {
    return await this.appService.redirect(id, request);
  }
}
