import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { customAlphabet } from 'nanoid';
import type { Request } from 'express';

import { test_url } from 'utils/url';
import { PrismaService } from 'prisma/prisma.service';
import { users } from 'prisma/generated/client';
import { ApiResponse } from 'shared/response.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'exceptions';

@Injectable()
export class LinkService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private prisma: PrismaService,
  ) {}

  async getAll() {
    const links = await this.prisma.links.findMany();

    return links
      .filter((x) => x.user_id === this.req.user?.id)
      .map((x) => ({
        ...x,
        short_url: `${this.req.protocol}://${this.req.get('host')}/${x.short_code}`,
      }));
  }

  async getMetrics(link_id: string) {
    const link = await this.prisma.links.findUnique({
      where: { short_code: link_id },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    if (link.user_id !== this.req.user?.id) {
      throw new ForbiddenException('You do not have access to these analytics');
    }

    const clicks = await this.prisma.clicks.findMany({
      where: { link_id: link.id },
      orderBy: { timestamp: 'asc' },
    });

    const timelineMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};

    clicks.forEach((click) => {
      const dateStr = click.timestamp.toISOString().split('T')[0];
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;

      const ref = click.referrer || 'direct';
      referrerMap[ref] = (referrerMap[ref] || 0) + 1;

      const browser = this.parseBrowser(click.user_agent);
      browserMap[browser] = (browserMap[browser] || 0) + 1;
    });

    return new ApiResponse(
      'Link mertrics successfully retrieved',
      {
        totalClicks: clicks.length,
        timeline: Object.entries(timelineMap).map(([date, count]) => ({
          date,
          clicks: count,
        })),
        referrers: Object.entries(referrerMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        browsers: Object.entries(browserMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
      },
      HttpStatus.OK,
    );
  }

  async shorten(original_url: string, user: users) {
    if (!original_url)
      throw new BadRequestException('Missing original_url field');

    if (!test_url.test(original_url))
      throw new BadRequestException('The url inputed must be in a URL format');

    const is_stored = await this.prisma.links.findFirst({
      where: { original_url, user_id: user.id },
    });

    if (is_stored)
      throw new ConflictException('This url has already been stored');

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

    const data = {
      short_code: nanoid(),
      original_url,
      user_id: user.id,
    };

    const saved_link = await this.prisma.links.create({ data });

    let { user_id, ...link } = saved_link;

    const short_url = `${this.req.protocol}://${this.req.get('host')}/${saved_link.short_code}`;

    (link as any).short_url = short_url;

    return new ApiResponse(
      'URL successfully shortned',
      { link },
      HttpStatus.CREATED,
    );
  }

  async update(id: string, original_url: string) {
    if (!id) throw new BadRequestException('Missing id param');

    if (!original_url)
      throw new BadRequestException('Missing original_url field');

    if (!test_url.test(original_url))
      throw new BadRequestException('The url inputed must be in a URL format');

    const url = await this.prisma.links.findUnique({ where: { id } });

    if (!url)
      throw new NotFoundException(`The url with id: ${id} was not found`);

    const is_stored = await this.prisma.links.findFirst({
      where: { original_url, id: { not: id } },
    });

    if (is_stored)
      throw new BadRequestException('This url has already been stored');

    const updated_url = await this.prisma.links.update({
      where: { id },
      data: { original_url },
    });

    (updated_url as any).short_url =
      `${this.req.protocol}://${this.req.get('host')}/${updated_url.short_code}`;

    return {
      success: true,
      data: { link: updated_url },
      message: 'The url has been successfully updated',
      statusCode: HttpStatus.OK,
    };
  }

  async delete(id: string) {
    if (!id) throw new BadRequestException('Missing id param');

    const link = await this.prisma.links.findUnique({ where: { id } });

    if (!link)
      throw new NotFoundException(`The data with id: ${id} was not found`);

    await this.prisma.links.delete({ where: { id } });

    (link as any).short_url =
      `${this.req.protocol}://${this.req.get('host')}/${link.short_code}`;

    return {
      success: true,
      data: { link },
      message: 'The link has been successfully deleted',
      statusCode: HttpStatus.OK,
    };
  }

  private parseBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('opr/') || ua.includes('opera')) return 'Opera';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('safari')) return 'Safari';
    return 'Other/Bots';
  }
}
