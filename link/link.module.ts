import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'env';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '5H' },
    }),
  ],
  controllers: [LinkController],
  providers: [LinkService, PrismaService],
})
export class LinkModule {}
