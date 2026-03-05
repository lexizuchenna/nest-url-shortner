import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { customAlphabet } from 'nanoid';
import { test_url } from 'utils/url';
import type { Request } from 'express';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'exceptions';

@Injectable()
export class AppService {
  constructor(@Inject(REQUEST) private readonly req: Request) {}
  private static readonly urls: Array<IUrl> = [];

  getAll(): Array<IUrl> {
    return AppService.urls;
  }

  redirect(id: string): { url: string; statusCode: number } {
    const url = AppService.urls.find((u) => u.id === id);

    if (!url) throw new NotFoundException(`No url with id: ${id} found`);

    return { url: url.original_url, statusCode: HttpStatus.PERMANENT_REDIRECT };
  }

  shorten(original_url: string) {
    if (!original_url)
      throw new BadRequestException('Missing original_url field');

    if (!test_url.test(original_url))
      throw new BadRequestException('The url inputed must be in a URL format');

    const is_stored = AppService.urls.find(
      (u) => u.original_url === original_url,
    );

    if (is_stored)
      throw new ConflictException('This url has already been stored');

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

    const id = nanoid();

    const url = {
      id,
      original_url,
      created_at: new Date().toISOString(),
      shortened_url: `${this.req.protocol}://${this.req.get('host')}/${id}`,
    };

    AppService.urls.push(url);

    return {
      success: true,
      data: { url },
      message: 'URL successfully shortned',
      statusCode: HttpStatus.CREATED,
    };
  }

  update(id: string, original_url: string) {
    if (!id) throw new BadRequestException('Missing id param');

    if (!original_url)
      throw new BadRequestException('Missing original_url field');

    if (!test_url.test(original_url))
      throw new BadRequestException('The url inputed must be in a URL format');

    const index = AppService.urls.findIndex((u) => u.id === id);

    const is_stored = AppService.urls.find(
      (u) => u.original_url === original_url && u.id !== id,
    );

    if (is_stored)
      throw new BadRequestException('This url has already been stored');

    if (index === -1)
      throw new NotFoundException(`The url with id: ${id} was not found`);

    AppService.urls[index].original_url = original_url;

    return {
      success: true,
      data: { url: AppService.urls[index] },
      message: 'The url has been successfully updated',
      statusCode: HttpStatus.OK,
    };
  }

  delete(id: string) {
    if (!id) throw new BadRequestException('Missing id param');

    const index = AppService.urls.findIndex((u) => u.id === id);

    if (index === -1)
      throw new NotFoundException(`The url with id: ${id} was not found`);

    const url = AppService.urls[index];

    AppService.urls.splice(index, 1);

    return {
      success: true,
      data: { url },
      message: 'The url has been successfully deleted',
      statusCode: HttpStatus.OK,
    };
  }
}
