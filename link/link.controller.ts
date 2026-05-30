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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateLinkRequestDto,
  CreateLinkResponseDto,
  DeleteLinkResDto,
  GetAllLinksResDto,
  GetMetricsResDto,
} from 'link/link.dto';
import { LinkService } from 'link/link.service';
import { links, users } from 'prisma/generated/client';
import { AuthGuard } from 'guard/auth.guard';
import { ActiveUser } from 'decorators/user.decorator';

@ApiTags('URL')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('url')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all shortned URL for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllLinksResDto,
  })
  async getAll(): Promise<IRes<{ links: Array<links> }>> {
    return {
      success: true,
      message: 'All url successfully returned',
      data: { links: await this.linkService.getAll() },
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Shoten url' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'URL shortned',
    type: CreateLinkResponseDto,
  })
  async shorten(
    @Body() { original_url }: CreateLinkRequestDto,
    @ActiveUser() user: users,
  ) {
    return await this.linkService.shorten(original_url, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get metrics of the link',
    description: 'Returns information/metrics of the id of the provided link',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMetricsResDto,
  })
  async getMetrics(@Param('id') id: string) {
    return await this.linkService.getMetrics(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Updates a link',
    description: 'Update the original_url of a shortned url',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateLinkResponseDto,
  })
  async update(
    @Body() { original_url }: CreateLinkRequestDto,
    @Param('id') id: string,
  ) {
    return this.linkService.update(id, original_url);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a link',
    description: 'Deteles all associated data of a link and returns the link',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteLinkResDto,
  })
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.linkService.delete(id);
  }
}
