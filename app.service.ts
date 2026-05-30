import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'exceptions';
import type { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  get(req: Request) {
    return {
      message: 'Server is healthy',
      status: 'ok',
      timestamp: new Date().toISOString(),
      docs: `${req.protocol}://${req.host}/api/v1/docs`,
    };
  }

  async redirect(id: string, req: Request) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const referrer = req.headers['referer'] || 'direct';

    const result = await this.prisma.$transaction(async (tx) => {
      const link = await tx.links.findUnique({
        where: { short_code: id },
      });

      if (!link) {
        throw new NotFoundException(`No url with id: ${id} found`);
      }

      await tx.clicks.create({
        data: {
          link_id: link.id,
          user_id: link.user_id,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer: referrer,
        },
      });

      return link;
    });

    return { url: result.original_url };
  }
}
