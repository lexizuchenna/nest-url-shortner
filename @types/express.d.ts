import { users } from 'prisma/generated/client';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<users, 'password'>;
    }
  }
}
