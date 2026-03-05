import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

export const env = {
  PORT: process.env.PORT || 4000,
} as const;
