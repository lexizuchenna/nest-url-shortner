import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { users } from 'prisma/generated/client';

export const ActiveUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as users;
  },
);
