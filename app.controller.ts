import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUrlDto } from 'url/create-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): IRes<{ urls: Array<IUrl> }> {
    return {
      success: true,
      message: 'All url successfully returned',
      data: { urls: this.appService.getAll() },
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  shorten(@Body() { original_url }: CreateUrlDto): IRes<{ url: IUrl }> {
    return this.appService.shorten(original_url);
  }

  @Get(':id')
  @Redirect()
  redirect(@Param('id') id: string): { url: string; statusCode: number } {
    return this.appService.redirect(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() { original_url }: CreateUrlDto,
    @Param('id') id: string,
  ): IRes<{ url: IUrl }> {
    return this.appService.update(id, original_url);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): IRes<{ url: IUrl }> {
    return this.appService.delete(id);
  }
}
