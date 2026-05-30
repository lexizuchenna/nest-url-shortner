import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'user/user.module';
import { LinkModule } from 'link/link.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [UserModule, LinkModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
